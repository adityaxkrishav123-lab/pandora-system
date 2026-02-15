import { supabase } from './supabaseClient';

export const executeAutoProduction = async (recipeId, targetAmount) => {
  try {
    // 1. Fetch all ingredients for the specific PCB
    const { data: recipeItems, error: recipeError } = await supabase
      .from('recipes')
      .select('component_id, amount_per_unit, inventory(name, current_stock)')
      .eq('recipe_id', recipeId);

    if (recipeError || !recipeItems) throw new Error("Recipe not found in Neural Database.");

    // 2. Execute the stock subtraction loop
    for (const item of recipeItems) {
      const totalNeeded = item.amount_per_unit * targetAmount;
      const newStock = item.inventory.current_stock - totalNeeded;

      const { error: updateError } = await supabase
        .from('inventory')
        .update({ current_stock: newStock })
        .eq('id', item.component_id);

      if (updateError) console.error(`Failed to update ${item.inventory.name}`);
    }

    return { success: true, message: `Production of ${targetAmount} units complete.` };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
