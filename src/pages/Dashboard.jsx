import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import InventoryCard from '../components/InventoryCard';

const Dashboard = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    // 1. Fetch physical stock from Supabase
    let { data, error } = await supabase.from('components').select('*');
    
    // 2. Logic: In a real scenario, we'd then map this data 
    // to our Render AI API to get the "days_left" prediction.
    if (!error) setComponents(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {components.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};
