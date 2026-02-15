/**
 * Friday's Neural Bridge
 * Connects React to the FastAPI Master Backend
 */
export const getFridayForecast = async (inventoryItem) => {
  try {
    // 💡 Render URL or Localhost (Match your backend port)
    const BACKEND_URL = 'http://localhost:8000'; 

    const response = await fetch(`${BACKEND_URL}/predict`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_name: inventoryItem.name,         // Added for Llama-3 context
        consumption: inventoryItem.consumption_rate || 45, 
        current_stock: inventoryItem.current_stock,
        min_required: inventoryItem.min_required,
        // The following are processed by Friday for deeper insights
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        week: Math.ceil(new Date().getDate() / 7),
        cost: inventoryItem.unit_cost || 12.5
      }),
    });

    if (!response.ok) throw new Error("Neural Link Offline");

    const data = await response.json();
    
    // Returns: { item, forecast, friday_advice, engine }
    return data; 
  } catch (error) {
    console.error("Friday AI Error:", error);
    return null;
  }
};
