import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';

export const processUploadedFile = async (file) => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const pcbName = file.name.split('.')[0];

      for (const row of json) {
        const name = row['Component'] || row['Part Description'] || row['Description'];
        const qty = parseInt(row['Qty'] || row['Quantity'] || 1);

        if (name) {
          const { data: part } = await supabase.from('inventory').upsert({ name }, { onConflict: 'name' }).select().single();
          if (part) {
            await supabase.from('recipes').upsert({ recipe_id: pcbName, component_id: part.id, amount_per_unit: qty });
          }
        }
      }
      resolve(pcbName);
    };
    reader.readAsArrayBuffer(file);
  });
};
