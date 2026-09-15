import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const limit = parseInt(req.query.limit || '30', 10);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { message, icon, color } = req.body;
      if (!message) return res.status(400).json({ error: 'message is required' });
      const { data, error } = await supabase
        .from('activities')
        .insert({
          message,
          icon: icon || 'info',
          color: color || 'text-slate-300',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('activities API error:', err);
    res.status(500).json({ error: err.message });
  }
}
