import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status, triage, q } = req.query;
      let query = supabase.from('patients').select('*').order('id', { ascending: false });
      if (status && status !== 'all') query = query.eq('status', status);
      if (triage) query = query.eq('triage', triage);
      if (q) query = query.or(`name.ilike.%${q}%,condition.ilike.%${q}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const {
        name, age, gender, condition, department, vitals,
        heart_rate, bp, o2, status, triage,
      } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });

      const { data, error } = await supabase
        .from('patients')
        .insert({
          name,
          age: age || 0,
          gender: gender || 'U',
          condition: condition || 'Unknown',
          department: department || 'ER',
          vitals: vitals || 'BP 120/80 • HR 88',
          heart_rate: heart_rate || 88,
          bp: bp || '120/80',
          o2: o2 || 98,
          status: status || 'stable',
          triage: triage || 'green',
          arrived_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;

      await supabase.from('activities').insert({
        message: `${name} admitted to ${department || 'ER'}`,
        icon: 'user-plus',
        color: 'text-emerald-400',
      });

      const { data: metrics } = await supabase.from('hospital_metrics').select('*').limit(1).single();
      if (metrics) {
        await supabase
          .from('hospital_metrics')
          .update({
            available_beds: Math.max(0, (metrics.available_beds || 0) - 1),
            er_patients: (metrics.er_patients || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', metrics.id);
      }

      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase
        .from('patients')
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
      const { data: patient } = await supabase.from('patients').select('name').eq('id', id).single();
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) throw error;

      if (patient) {
        await supabase.from('activities').insert({
          message: `${patient.name} discharged`,
          icon: 'user-check',
          color: 'text-sky-400',
        });
      }

      const { data: metrics } = await supabase.from('hospital_metrics').select('*').limit(1).single();
      if (metrics) {
        await supabase
          .from('hospital_metrics')
          .update({
            available_beds: (metrics.available_beds || 0) + 1,
            er_patients: Math.max(0, (metrics.er_patients || 0) - 1),
            updated_at: new Date().toISOString(),
          })
          .eq('id', metrics.id);
      }

      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('patients API error:', err);
    res.status(500).json({ error: err.message });
  }
}
