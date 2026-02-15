import { supabase } from './supabaseClient';

export const executeAutoProduction = async (recipeId, quantity) => {
  try {
    // 1. Fetch the Recipe (BOM)
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*, inventory(id, name, current_stock, threshold)')
      .eq('recipe_id', recipeId);

    if (recipeError || !recipe || recipe.length === 0) throw new Error("Recipe Not Found");

    // 2. Pre-Check: Do we have enough stock?
    for (const req of recipe) {
      if (req.inventory.current_stock < (req.amount_per_unit * quantity)) {
        throw new Error(`Insufficient stock for ${req.inventory.name}`);
      }
    }

    // 3. Deduction Loop
    const updates = recipe.map(req => {
      const newStock = req.inventory.current_stock - (req.amount_per_unit * quantity);
      return supabase
        .from('inventory')
        .update({ current_stock: newStock })
        .eq('id', req.component_id);
    });

    await Promise.all(updates);

    // 4. Log to Production History (for Graphs)
    await supabase.from('production_history').insert({
      recipe_id: recipeId,
      units_produced: quantity,
      timestamp: new Date().toISOString()
    });

    return { success: true, message: `Neural Sync: ${quantity} units of ${recipeId} processed.` };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
