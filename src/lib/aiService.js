/**
 * 🛰️ Friday's Neural Bridge (Production Grade)
 * Connects GitHub Pages Frontend to Render FastAPI Backend
 */

// ⚡ AUTO-CONFIG: Switches between Render and Localhost automatically
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : 'https://pandora-backend-1.onrender.com';

export const getFridayForecast = async (inventoryItem) => {
  try {
    console.log(`🤖 Friday: Establishing link to ${BACKEND_URL}...`);

    const response = await fetch(`${BACKEND_URL}/predict`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_name: inventoryItem.name,
        consumption: parseFloat(inventoryItem.consumption_rate) || 45, 
        current_stock: parseInt(inventoryItem.current_stock),
        min_required: parseInt(inventoryItem.min_required),
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        week: Math.ceil(new Date().getDate() / 7),
        cost: parseFloat(inventoryItem.unit_cost) || 12.5
      }),
    });

    // Handle Render's "Cold Start" (Free tier sleep)
    if (response.status === 503 || response.status === 502) {
      throw new Error("Friday is waking up... please try again in 30 seconds.");
    }

    if (!response.ok) throw new Error("Neural Link Offline");

    const data = await response.json();
    
    /**
     * Response Structure:
     * { item, forecast, friday_advice, engine }
     */
    return {
      forecasted_demand: data.forecast, // Mapping to match your Dashboard state
      friday_advice: data.friday_advice,
      mode: data.engine
    }; 

  } catch (error) {
    console.error("❌ Friday AI Error:", error.message);
    // Return a graceful fallback if the server is down
    return {
      forecasted_demand: (inventoryItem.consumption_rate || 45) * 1.1,
      friday_advice: "Neural Link Offline. Using local heuristic fallback.",
      mode: "OFFLINE_FALLBACK"
    };
  }
};

/**
 * ⚡ Heartbeat Check
 * Use this to "ping" Friday when the dashboard first loads
 */
export const wakeUpFriday = async () => {
    try {
        await fetch(BACKEND_URL);
        console.log("🟢 Friday's Heartbeat Detected");
    } catch (e) {
        console.warn("🔴 Friday is currently deep-sleeping.");
    }
};
