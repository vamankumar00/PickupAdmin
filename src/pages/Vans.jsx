import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bus, 
  Users, 
  Settings, 
  ChevronRight, 
  MapPin, 
  ShieldCheck,
  Info,
  User as UserIcon
} from 'lucide-react'
import { getVans, getVanManifest } from '../services/api'

const Vans = () => {
  const [vans, setVans] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [selectedVan, setSelectedVan] = React.useState(null)
  const [manifest, setManifest] = React.useState(null)
  const [viewingManifest, setViewingManifest] = React.useState(false)

  const fetchVans = async () => {
    try {
      const response = await getVans()
      setVans(response.data)
    } catch (err) {
      console.error('Failed to fetch fleet data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewManifest = async (van) => {
    setSelectedVan(van)
    setViewingManifest(true)
    setManifest(null)
    try {
      const response = await getVanManifest(van.id)
      setManifest(response.data)
    } catch (err) {
      console.error('Failed to load manifest', err)
    }
  }

  React.useEffect(() => {
    fetchVans()
  }, [])

  return (
    <div className="space-y-8 fade-in pb-12 font-sans">
      {/* Structural Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <Bus size={14} className="text-suzuki-blue" /> Fleet Command
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Van Inventory</h2>
        </div>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg flex items-center gap-2 text-xs font-bold transition-all hover:bg-slate-50 shadow-sm">
          <Settings size={16} /> Fleet Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="pro-card h-48 animate-pulse bg-slate-50/50"></div>
          ))
        ) : (
          vans.map((van) => (
            <motion.div 
              key={van.id}
              layoutId={`van-${van.id}`}
              className="pro-card group cursor-pointer hover:border-suzuki-blue/40 transition-all overflow-hidden"
              onClick={() => handleViewManifest(van)}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:text-suzuki-blue transition-colors border border-slate-200">
                    <Bus size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-2">{van.vanNumber}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{van.registrationNumber}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter border ${
                  van.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {van.status}
                </span>
              </div>
              
              <div className="p-5 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <UserIcon size={14} />
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Driver</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">{van.driverName}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Occupancy</p>
                   <p className="text-sm font-black text-slate-900 mt-1">{van.occupancy} / {van.capacity}</p>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-100 flex justify-between items-center bg-white group-hover:bg-slate-50 transition-colors">
                 <span className="text-[10px] font-bold text-suzuki-blue uppercase tracking-widest">View Detailed Manifest</span>
                 <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Manifest Overlay */}
      <AnimatePresence>
        {viewingManifest && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setViewingManifest(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-slate-900 text-white relative">
                 <div className="flex justify-between items-start">
                    <div>
                       <h2 className="text-2xl font-bold tracking-tight mb-1">{selectedVan?.vanNumber}</h2>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={12} /> {selectedVan?.registrationNumber} · {selectedVan?.driverName}
                       </p>
                    </div>
                    <button 
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      onClick={() => setViewingManifest(false)}
                    >
                       <ChevronRight className="rotate-90" />
                    </button>
                 </div>
              </div>

              <div className="p-8">
                 <div className="flex items-center gap-3 mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <Info size={18} className="text-suzuki-blue" />
                    <p className="text-xs font-bold text-suzuki-blue uppercase tracking-wide">Optimization: Gender Buffer Policy Active</p>
                 </div>

                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {manifest ? (
                      manifest.assignments.map((seat, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          seat.isBufferSeat ? 'bg-slate-50 border-dashed border-slate-300 opacity-60' : 'bg-white border-slate-100'
                        }`}>
                           <div className="flex items-center gap-5">
                              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                 {seat.seatNumber}
                              </span>
                              <div>
                                 {seat.isBufferSeat ? (
                                   <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                      <ShieldCheck size={14} /> GENDER BUFFER
                                   </div>
                                 ) : (
                                   <>
                                     <p className="font-bold text-slate-900 text-sm leading-none mb-1">{seat.employeeName}</p>
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{seat.employeeCode} · {seat.gender === 'F' ? 'FEMALE' : 'MALE'}</p>
                                   </>
                                 )}
                              </div>
                           </div>
                           {!seat.isBufferSeat && (
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               seat.gender === 'F' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-suzuki-blue'
                             }`}>
                                {seat.gender}
                             </span>
                           )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center py-10 gap-4 opacity-40">
                         <div className="w-10 h-10 border-4 border-slate-200 border-t-suzuki-blue rounded-full animate-spin"></div>
                         <p className="text-xs font-bold uppercase tracking-widest">Retrieving Digital Manifest</p>
                      </div>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Vans
