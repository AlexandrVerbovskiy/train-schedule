import React, { useState, useEffect, useCallback } from 'react';
import * as trainsApi from '../api/trains';
import Input from '../components/Common/Input';
import { formatTime } from '../utils/format';

const ITEMS_PER_PAGE = 10;

const SchedulePage = () => {
  const [trains, setTrains] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await trainsApi.getAllTrains(page, ITEMS_PER_PAGE, search);
      setTrains(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('Failed to load schedule');
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchedule();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSchedule]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / ITEMS_PER_PAGE)) {
      setPage(newPage);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-6 space-y-12 min-h-screen bg-slate-950/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-3xl animate-in fade-in duration-700">
      
      <div className="space-y-8 text-center pt-10">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white tracking-widest lowercase italic">Train Schedule</h1>
          <p className="text-slate-500 font-bold lowercase text-[10px] tracking-tight">Find Your Next Journey Across The Continent</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
           <Input 
             placeholder="Search by train number or destination..." 
             value={search}
             onChange={(e) => {
               setSearch(e.target.value);
               setPage(1);
             }}
             className="text-lg py-5 px-8 rounded-3xl bg-white/10"
           />
           <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-600 lowercase tracking-widest">
              <span>Active Fleet: {total} units</span>
              <span>Realway Network Live</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && trains.length === 0 ? (
          <div className="col-span-full py-20 text-center animate-pulse text-blue-500 font-black lowercase tracking-widest">Scanning network...</div>
        ) : (
          trains.map(train => (
            <div key={train.id} className="group p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6 hover:bg-white/10 transition-all border-b-4 border-blue-500/50 hover:-translate-y-2 duration-500">
              <div className="flex justify-between items-start">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-black tracking-widest lowercase shadow-lg shadow-blue-600/20">{train.trainNumber}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{train.type}</span>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-white lowercase tracking-tight">{train.name}</h4>
                
                <div className="space-y-4 pt-4 border-t border-white/5">
                  {train.routeItems && train.routeItems.length > 0 ? (
                    <div className="space-y-6">
                       <div className="flex items-start gap-4">
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                          <div className="space-y-1">
                             <div className="text-sm font-bold text-white lowercase">{train.routeItems[0]?.station?.name}</div>
                             <div className="text-[10px] text-slate-500 font-bold lowercase">Departure: {formatTime(train.routeItems[0]?.departureHour, train.routeItems[0]?.departureMinute, 'start')}</div>
                          </div>
                       </div>
                       
                       <div className="ml-1 w-[1px] h-6 bg-slate-800"></div>

                       <div className="flex items-start gap-4">
                          <div className="mt-1 w-2 h-2 rounded-full bg-slate-600"></div>
                          <div className="space-y-1">
                             <div className="text-sm font-bold text-white lowercase">{train.routeItems[train.routeItems.length - 1]?.station?.name}</div>
                             <div className="text-[10px] text-slate-500 font-bold lowercase">Arrival: {formatTime(train.routeItems[train.routeItems.length - 1]?.arrivalHour, train.routeItems[train.routeItems.length - 1]?.arrivalMinute, 'end')}</div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-700 font-bold lowercase italic text-center">Route undisclosed</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && trains.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="text-4xl font-black text-slate-800 lowercase italic">No matches found</div>
           <p className="text-slate-600 text-xs font-bold lowercase">Try another destination or train number</p>
        </div>
      )}

      {total > ITEMS_PER_PAGE && (
        <div className="flex justify-center gap-6 py-10">
          <button onClick={() => handlePageChange(page - 1)} className="px-8 py-3 bg-white/5 rounded-2xl font-black text-xs text-slate-500 hover:text-white transition-all lowercase">Prev</button>
          <div className="flex items-center"><span className="text-blue-500 font-black text-lg tracking-widest">{page} / {Math.ceil(total / ITEMS_PER_PAGE)}</span></div>
          <button onClick={() => handlePageChange(page + 1)} className="px-8 py-3 bg-white/5 rounded-2xl font-black text-xs text-slate-500 hover:text-white transition-all lowercase">Next</button>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
