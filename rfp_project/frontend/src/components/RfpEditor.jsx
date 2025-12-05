import React, { useState } from 'react';
import axios from 'axios';

export default function RfpEditor({ onCreated }) {
  const [nl, setNl] = useState('');
  const [structured, setStructured] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const r = await axios.post('/api/rfps/create', { nl_text: nl });
      setStructured(r.data);
      if(onCreated) onCreated(r.data.id);
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  }

  return (
    <div className="card p-4 border">
      <h2 className="font-semibold mb-2">Create RFP (NL)</h2>
      <textarea value={nl} onChange={e => setNl(e.target.value)} rows={6} className="w-full p-2 border" />
      <div className="mt-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={generate} disabled={loading}>Generate</button>
      </div>
      {structured && (
        <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(structured, null, 2)}</pre>
      )}
    </div>
  );
}
