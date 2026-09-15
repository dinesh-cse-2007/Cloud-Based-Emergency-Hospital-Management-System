import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status } = req.query;
      let query = supabase.from('incidents').select('*').order('id', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { title, description, location, severity, casualties, eta_minutes, status } = req.body;
      if (!title) return res.status(400).json({ error: 'title is required' });

      const { data, error } = await supabase
        .from('incidents')
        .insert({
          title,
          description: description || '',
          location: location || 'Unknown',
          severity: severity || 'high',
          casualties: casualties ?? 0,
          eta_minutes: eta_minutes ?? 10,
          status: status || 'dispatched',
        })
        .select()
        .single();
      if (error) throw error;

      await supabase.from('activities').insert({
        message: `Incident dispatched: ${title}`,
        icon: 'bell',
        color: 'text-orange-400',
      });

      const { data: available } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available')
        .limit(1);
      if (available && available.length > 0) {
        await supabase
          .from('ambulances')
          .update({
            status: 'enroute',
            eta_minutes: eta_minutes ?? 6,
            location: location || 'Scene',
            notes: title,
          })
          .eq('id', available[0].id);
      }

      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase
        .from('incidents')
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
      const { error } = await supabase.from('incidents').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('incidents API error:', err);
    res.status(500).json({ error: err.message });
  }
}
