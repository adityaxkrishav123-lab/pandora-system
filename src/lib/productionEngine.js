import { supabase } from './supabaseClient';

/**
 * PANDORA GHOST ENGINE
 * This function deducts the required components from inventory 
 * based on a "Recipe" (BOM) when the AI authorizes a run.
 */
export const executeAutoProduction = async (recipeId, quantity) => {
  try {
    // 1. Get the Recipe (What components are needed?)
    // In a hackathon, we can mock this or fetch from a 'recipes' table
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', recipeId);

    if (recipeError || !recipe) throw new Error("Recipe Not Found");

    // 2. Loop through components and subtract from inventory
    for (const requirement of recipe) {
      const { data: item } = await supabase
        .from('inventory')
        .select('current_stock')
        .eq('id', requirement.component_id)
        .single();

      const newStock = item.current_stock - (requirement.amount_per_unit * quantity);

      await supabase
        .from('inventory')
        .update({ current_stock: newStock })
        .eq('id', requirement.component_id);
    }

    // 3. Log the successful run
    return { success: true, message: `Produced ${quantity} units of ${recipeId}` };
  } catch (err) {
    console.error("Production Error:", err.message);
    return { success: false, error: err.message };
  }
};
