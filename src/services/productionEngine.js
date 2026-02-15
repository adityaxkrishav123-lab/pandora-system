import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const startProduction = async (pcbName, quantity) => {
  try {
    // 1. GET THE RECIPE
    const { data: recipeItems, error: recipeError } = await supabase
      .from('recipes')
      .select('*, inventory(id, name, current_stock, threshold)')
      .eq('recipe_id', pcbName);

    if (recipeError || !recipeItems.length) {
      throw new Error(`No recipe found for ${pcbName}`);
    }

    // 2. CHECK STOCK & REDUCE
    for (const item of recipeItems) {
      const requiredAmount = item.amount_per_unit * quantity;
      const newStock = item.inventory.current_stock - requiredAmount;

      // Update Inventory
      await supabase
        .from('inventory')
        .update({ current_stock: newStock })
        .eq('id', item.component_id);
        
      // Trigger Alert if below threshold
      if (newStock <= item.inventory.threshold) {
        console.warn(`⚠️ ALERT: ${item.inventory.name} is low on stock!`);
      }
    }

    // 3. LOG FOR GRAPHS
    await supabase.from('production_history').insert({
      recipe_id: pcbName,
      quantity_produced: quantity
    });

    return { success: true, message: `Production of ${quantity} units of ${pcbName} complete!` };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
