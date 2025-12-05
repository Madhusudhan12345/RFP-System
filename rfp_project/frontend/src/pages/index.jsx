import React, { useState } from 'react';
import RfpEditor from '../components/RfpEditor';
import VendorList from '../components/VendorList';

export default function Home() {
  const [selectedRfpId, setSelectedRfpId] = useState(null);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI RFP Management</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <RfpEditor onCreated={(id) => setSelectedRfpId(id)} />
        </div>
        <div>
          <VendorList selectedRfpId={selectedRfpId} />
        </div>
      </div>
    </div>
  );
}
