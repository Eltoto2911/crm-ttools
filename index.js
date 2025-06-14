import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_ANON_KEY'
);

export default function Home() {
  const [interventions, setInterventions] = useState([]);
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [statut, setStatut] = useState('À traiter');

  useEffect(() => {
    fetchInterventions();
  }, []);

  async function fetchInterventions() {
    const { data, error } = await supabase
      .from('interventions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Erreur de chargement', error);
    else setInterventions(data);
  }

  async function addIntervention() {
    const { error } = await supabase.from('interventions').insert({
      client_name: clientName,
      description,
      date,
      statut
    });
    if (error) {
      alert("Erreur lors de l'ajout");
      console.error(error);
    } else {
      setClientName('');
      setDescription('');
      setDate('');
      setStatut('À traiter');
      fetchInterventions();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📋 Mes interventions</h1>
      <div style={{ marginBottom: 20 }}>
        <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom du client" />
        <input value={date} onChange={e => setDate(e.target.value)} type="date" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <select value={statut} onChange={e => setStatut(e.target.value)}>
          <option>À traiter</option>
          <option>Planifiée</option>
          <option>En cours</option>
          <option>Terminée</option>
          <option>Annulée</option>
        </select>
        <button onClick={addIntervention}>Ajouter l'intervention</button>
      </div>
      <ul>
        {interventions.map((i) => (
          <li key={i.id}>
            <div><strong>Client :</strong> {i.client_name}</div>
            <div><strong>Date :</strong> {i.date}</div>
            <div><strong>Statut :</strong> {i.statut}</div>
            <div><strong>Description :</strong> {i.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}