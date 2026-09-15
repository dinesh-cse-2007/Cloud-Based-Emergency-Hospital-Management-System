import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { code, status, eta_minutes, location, crew, notes } = req.body;
      if (!code) return res.status(400).json({ error: 'code is required' });
      const { data, error } = await supabase
        .from('ambulances')
        .insert({
          code,
          status: status || 'available',
          eta_minutes: eta_minutes ?? null,
          location: location || 'Base',
          crew: crew || 'PARAMEDIC',
          notes: notes || '',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase
        .from('ambulances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      if (updates.status) {
        const { data: amb } = await supabase.from('ambulances').select('code').eq('id', id).single();
        if (amb) {
          await supabase.from('activities').insert({
            message: `${amb.code} status → ${updates.status}`,
            icon: 'truck',
            color: 'text-amber-400',
          });
        }
      }

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('ambulances').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('ambulances API error:', err);
    res.status(500).json({ error: err.message });
  }
}
