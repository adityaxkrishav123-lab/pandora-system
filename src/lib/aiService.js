/**
 * Friday's Neural Bridge
 * Connects React to the FastAPI/Flask AI Backend
 */
export const getFridayForecast = async (inventoryItem) => {
  try {
    // Note: Change 'localhost' to your deployed backend URL later
    const response = await fetch('http://localhost:5000/predict', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consumption: inventoryItem.consumption_rate || 45, // Features from your .pkl
        current_stock: inventoryItem.current_stock,
        min_required: inventoryItem.min_required,
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        week: Math.ceil(new Date().getDate() / 7),
        cost: inventoryItem.unit_cost || 12.5
      }),
    });

    if (!response.ok) throw new Error("Neural Link Offline");

    const data = await response.json();
    return data; // Returns { forecasted_demand: X, recommendation: "..." }
  } catch (error) {
    console.error("Friday AI Error:", error);
    return null;
  }
};
