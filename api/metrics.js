import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('hospital_metrics')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const updates = { ...req.body };
      delete updates.id;
      updates.updated_at = new Date().toISOString();

      const { data: existing } = await supabase
        .from('hospital_metrics')
        .select('id')
        .limit(1)
        .single();

      if (!existing) {
        const { data, error } = await supabase
          .from('hospital_metrics')
          .insert(updates)
          .select()
          .single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      const { data, error } = await supabase
        .from('hospital_metrics')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('metrics API error:', err);
    res.status(500).json({ error: err.message });
  }
}
