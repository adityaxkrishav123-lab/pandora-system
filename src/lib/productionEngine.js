import { supabase } from './supabaseClient';

/**
 * ⚡ FRIDAY PRODUCTION ENGINE (V2.5)
 * The "Ghost Engine" that handles inventory sync and production logging.
 */
export const executeAutoProduction = async (recipeId, quantity) => {
  try {
    // --- 1. THE PRIMARY DIRECTIVE: CALL THE DATABASE RPC ---
    // This triggers the SQL logic we wrote in Phase 1 for maximum speed and safety.
    const { data: rpcData, error: rpcError } = await supabase.rpc('execute_production_run', {
      target_recipe_id: recipeId,
      qty: quantity
    });

    // If the RPC exists and works, return that result immediately
    if (!rpcError && rpcData && rpcData[0]) {
      const result = rpcData[0];
      return { 
        success: result.success, 
        message: result.message || `Neural Sync: ${quantity} units of ${recipeId} processed via Ghost Engine.` 
      };
    }

    // --- 2. THE FALLBACK: FRONTEND LOGIC (In case RPC is not yet deployed) ---
    console.warn("Friday: RPC Ghost Engine not detected. Falling back to manual deduction loop.");
    
    // Fetch Recipe (BOM)
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*, inventory(id, name, current_stock)')
      .eq('recipe_id', recipeId);

    if (recipeError || !recipe || recipe.length === 0) throw new Error("Recipe Blueprint Not Found");

    // Stock Validation
    for (const req of recipe) {
      const requiredAmount = req.amount_per_unit * quantity;
      if (req.inventory.current_stock < requiredAmount) {
        throw new Error(`Insufficient stock for ${req.inventory.name}. Required: ${requiredAmount}`);
      }
    }

    // Process Deductions
    const updates = recipe.map(req => (
      supabase
        .from('inventory')
        .update({ current_stock: req.inventory.current_stock - (req.amount_per_unit * quantity) })
        .eq('id', req.component_id)
    ));

    await Promise.all(updates);

    // Record to Neural History
    await supabase.from('production_history').insert({
      recipe_id: recipeId,
      units_produced: quantity,
      timestamp: new Date().toISOString()
    });

    return { 
      success: true, 
      message: `Neural Sync: Manual process complete for ${quantity} units.` 
    };

  } catch (err) {
    console.error("Friday Engine Error:", err.message);
    return { success: false, error: err.message };
  }
};
