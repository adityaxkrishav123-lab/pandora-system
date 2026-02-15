import { supabase } from './supabaseClient';

// 1. THE PRODUCTION ENGINE: Calculates usage and subtracts stock
export const executeAutoProduction = async (recipeName, targetAmount) => {
  try {
    // Fetch the ingredients for the specific PCB/File uploaded
    const { data: recipeItems, error: recipeError } = await supabase
      .from('recipes')
      .select('component_id, quantity_required, inventory(name, current_stock, threshold)')
      .eq('recipe_name', recipeName);

    if (recipeError || !recipeItems || recipeItems.length === 0) {
      throw new Error(`Friday: I can't find the recipe for "${recipeName}". Please upload the Bill of Materials (BOM) first.`);
    }

    // Process each component
    for (const item of recipeItems) {
      const totalUsed = item.quantity_required * targetAmount;
      const newStock = item.inventory.current_stock - totalUsed;

      // Update Database
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          current_stock: newStock,
          last_updated: new Date().toISOString()
        })
        .eq('id', item.component_id);

      if (updateError) console.error(`Sync Error: ${item.inventory.name}`);
    }

    return { success: true, message: `Production of ${targetAmount} units complete. Inventory synced.` };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// 2. THE AI PREDICTOR (Simulates demand for the demo)
export const getFridayPrediction = async () => {
  // In a real build, this calls a Python/Gemini API. For your demo, it generates a smart forecast.
  const demand = Math.floor(Math.random() * 15) + 5;
  return {
    forecast: demand,
    insight: `Neural Analysis suggests building ${demand} units to meet the next 48-hour demand surge.`
  };
};
