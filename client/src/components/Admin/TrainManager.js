import React, { useState, useEffect, useCallback } from 'react';
import * as trainsApi from '../../api/trains';
import * as stationsApi from '../../api/stations';
import { PrimaryButton, GhostButton, DangerButton } from '../Common/Button';
import Input from '../Common/Input';

const TrainManager = () => {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trainNumber, setTrainNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('passenger');
  const [routeItems, setRouteItems] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [trainsData, stationsData] = await Promise.all([
        trainsApi.getAllTrains(page, 6),
        stationsApi.getAllStations()
      ]);
      
      if (trainsData.data) setTrains(trainsData.data);
      if (stationsData) setStations(stationsData);
    } catch (err) {
      setError('Dispatch error during tracking');
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddRoutePoint = () => {
    setRouteItems([...routeItems, { 
      stationId: stations[0]?.id || '', 
      arrivalTime: '', 
      departureTime: '', 
      order: routeItems.length + 1 
    }]);
  };

  const updateRouteItem = (index, field, value) => {
    const updated = [...routeItems];
    updated[index][field] = value;
    setRouteItems(updated);
  };

  const removeRouteItem = (index) => {
    setRouteItems(routeItems.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await trainsApi.createTrain({ 
        trainNumber, 
        name, 
        type, 
        routeItems: routeItems.map((item, idx) => ({
          stationId: item.stationId,
          order: idx + 1,
          arrivalHour: item.arrivalTime ? parseInt(item.arrivalTime.split(':')[0], 10) : null,
          arrivalMinute: item.arrivalTime ? parseInt(item.arrivalTime.split(':')[1], 10) : null,
          departureHour: item.departureTime ? parseInt(item.departureTime.split(':')[0], 10) : null,
          departureMinute: item.departureTime ? parseInt(item.departureTime.split(':')[1], 10) : null
        }))
      });

      if (data.error || data.message) throw new Error(data.message || 'Creation failed');
      
      setTrainNumber('');
      setName('');
      setRouteItems([]);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this train?')) return;
    try {
      await trainsApi.deleteTrain(id);
      fetchData();
    } catch (err) {
      setError('Deletion failed');
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleCreate} className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-10">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white italic italic tracking-tighter">New Voyage Commission</h3>
          <p className="text-slate-500 font-bold text-[10px] tracking-widest">Construct fleet and assign destinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input label="Designation" placeholder="705K" value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} />
          <Input label="Name" placeholder="Kyiv - Lviv" value={name} onChange={(e) => setName(e.target.value)} />
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 tracking-widest pl-2">Fleet Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl text-slate-100 font-bold focus:border-blue-500/50 outline-none transition-all text-xs"
            >
              <option value="passenger" className="bg-slate-900">Passenger</option>
              <option value="express" className="bg-slate-900">Express</option>
              <option value="intercity" className="bg-slate-900">Intercity+</option>
            </select>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-black text-blue-500 tracking-widest">Route Points Builder</h4>
            <GhostButton type="button" onClick={handleAddRoutePoint} className="text-[10px]">
              Add Stop
            </GhostButton>
          </div>

          <div className="space-y-4">
            {routeItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 items-end animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Station</label>
                  <select 
                    value={item.stationId}
                    onChange={(e) => updateRouteItem(index, 'stationId', e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-xs font-bold text-white outline-none"
                  >
                    {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <Input 
                  label="Arrival" 
                  type="time" 
                  value={item.arrivalTime} 
                  onChange={(e) => updateRouteItem(index, 'arrivalTime', e.target.value)} 
                />
                <Input 
                  label="Departure" 
                  type="time" 
                  value={item.departureTime} 
                  onChange={(e) => updateRouteItem(index, 'departureTime', e.target.value)} 
                />
                <DangerButton type="button" onClick={() => removeRouteItem(index)} className="py-3 text-[10px]">x</DangerButton>
              </div>
            ))}
          </div>
        </div>

        <PrimaryButton className="w-full md:w-64" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </PrimaryButton>
        {error && <p className="text-red-500 text-xs font-black italic">Error: {error}</p>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trains.map(train => (
          <div key={train.id} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6 hover:bg-white/10 transition-all border-b-4 border-blue-500/50">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-blue-600/20 text-blue-400 rounded-xl text-xs font-black tracking-widest leading-none border border-blue-500/20 uppercase">{train.trainNumber}</span>
              <button onClick={() => handleDelete(train.id)} className="text-slate-500 hover:text-red-500 transition-colors font-black">x</button>
            </div>
            <div className="space-y-4">
                <h4 className="text-xl font-black text-white uppercase">{train.name}</h4>
                
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-500 tracking-widest mb-2 border-b border-white/5 pb-1">Route Overview</div>
                  {train.routeItems && train.routeItems.length > 0 ? (
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-bold">{train.routeItems[0]?.station?.name}</span>
                          <span className="text-blue-500 font-black">Start</span>
                       </div>
                       {train.routeItems.length > 1 && (
                         <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-bold">{train.routeItems[train.routeItems.length - 1]?.station?.name}</span>
                            <span className="text-blue-500 font-black">End</span>
                         </div>
                       )}
                       <div className="text-[9px] text-slate-600 font-bold mt-2">Stops Count: {train.routeItems.length}</div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-600 font-bold italic">No destinations assigned</div>
                  )}
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 py-10">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-6 py-2 bg-white/5 rounded-xl font-black text-xs text-slate-500 hover:text-white transition-all">Prev</button>
        <div className="flex items-center px-6"><span className="text-blue-500 font-black text-sm tracking-widest">{page}</span></div>
        <button onClick={() => setPage(p => p + 1)} className="px-6 py-2 bg-white/5 rounded-xl font-black text-xs text-slate-500 hover:text-white transition-all">Next</button>
      </div>
      
    </div>
  );
};

export default TrainManager;
