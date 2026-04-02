import React, { useState, useEffect } from 'react';
import * as stationsApi from '../../api/stations';
import { PrimaryButton } from '../Common/Button';
import Input from '../Common/Input';

const StationManager = () => {
  const [stations, setStations] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStations = async () => {
    try {
      const data = await stationsApi.getAllStations();
      if (data && !data.error) setStations(data);
    } catch (err) {
      setError('Failed to download stations');
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName) return;
    
    setLoading(true);
    try {
      const data = await stationsApi.createStation(newName);
      if (data.error || data.message) throw new Error(data.message || 'Error occurred');
      
      setStations([...stations, data]);
      setNewName('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Abandon this station permanently?')) return;
    
    try {
      await stationsApi.deleteStation(id);
      setStations(stations.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete station');
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleAdd} className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Found New Outpost</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input 
            label="Station Name" 
            placeholder="E.g. Kyiv-Lviv" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
          />
          <PrimaryButton className="md:w-48 mb-1" type="submit" disabled={loading}>
            {loading ? 'Founding...' : 'Found'}
          </PrimaryButton>
        </div>
        {error && <p className="text-red-500 font-black text-xs uppercase underline">Alert: {error}</p>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div key={station.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all hover:border-blue-500/50">
            <span className="font-black text-slate-100 uppercase tracking-widest">{station.name}</span>
            <button 
              onClick={() => handleDelete(station.id)}
              className="text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:text-red-600 font-black text-xs tracking-tighter"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default StationManager;
