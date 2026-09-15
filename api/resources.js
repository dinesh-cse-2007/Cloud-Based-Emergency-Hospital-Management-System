import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { name, category, quantity, unit, min_threshold, icon } = req.body;
      if (!name) return res.status(400).json({ error: 'name is required' });
      const { data, error } = await supabase
        .from('resources')
        .insert({
          name,
          category: category || 'supplies',
          quantity: quantity ?? 0,
          unit: unit || 'units',
          min_threshold: min_threshold ?? 10,
          icon: icon || '📦',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, restock, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });

      if (restock) {
        const { data: item } = await supabase.from('resources').select('*').eq('id', id).single();
        if (!item) return res.status(404).json({ error: 'Resource not found' });
        const addQty = typeof restock === 'number' ? restock : Math.max(50, (item.min_threshold || 10) * 5);
        const { data, error } = await supabase
          .from('resources')
          .update({ quantity: (item.quantity || 0) + addQty })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;

        await supabase.from('activities').insert({
          message: `Restock ordered: ${item.name} (+${addQty})`,
          icon: 'package',
          color: 'text-teal-400',
        });

        return res.status(200).json(data);
      }

      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('resources API error:', err);
    res.status(500).json({ error: err.message });
  }
}
