import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xcrnrbuvojrsqclnavuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjcm5yYnZ2b2pyc3FjbG5hdnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDI5MjksImV4cCI6MjA2NTUxODkyOX0.R9mpS1hQSTAjHgHGjNCnKj7ljXLwMyphLIOD1U-nICQ';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      statut,
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
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h1>📋 Mes interventions</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nom du client"
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={{ width: '100%', padding: 8, marginBottom: 10, height: 80 }}
        />
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        >
          <option>À traiter</option>
          <option>Planifiée</option>
          <option>En cours</option>
          <option>Terminée</option>
          <option>Annulée</option>
        </select>
        <button
          onClick={addIntervention}
          style={{
            padding: 10,
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          Ajouter l'intervention
        </button>
      </div>

      <h2>📌 Liste des interventions</h2>
      {interventions.length === 0 && <p>Aucune intervention</p>}
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {interventions.map((i) => (
          <li
            key={i.id}
            style={{
              border: '1px solid #ccc',
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
            }}
          >
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
