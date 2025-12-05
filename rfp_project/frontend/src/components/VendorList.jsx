import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VendorList({ selectedRfpId }) {
  const [vendors, setVendors] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => { fetchVendors(); }, []);
  async function fetchVendors(){ const r = await axios.get('/api/vendors'); setVendors(r.data); }

  async function send() {
    if(!selectedRfpId) return alert('Select or create an RFP first');
    await axios.post(`/api/rfps/${selectedRfpId}/send`, { vendor_ids: selected, message: 'Please respond with your proposal.' });
    alert('Sent');
  }

  return (
    <div className="card p-4 border">
      <h2 className="font-semibold mb-2">Vendors</h2>
      <div className="space-y-2">
        {vendors.map(v => (
          <div key={v.id}>
            <label>
              <input type="checkbox" value={v.id} onChange={e => setSelected(prev => e.target.checked ? [...prev, v.id] : prev.filter(x => x!==v.id))} /> {v.name} ({v.contactEmail})
            </label>
          </div>
        ))}
      </div>
      <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded" onClick={send}>Send RFP</button>
    </div>
  );
}
