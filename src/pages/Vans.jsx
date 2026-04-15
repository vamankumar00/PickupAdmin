import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bus, 
  ChevronRight, 
  MapPin, 
  ShieldCheck,
  Info,
  MoreVertical,
  ChevronLeft,
  Users,
  Search,
  Filter,
  X
} from 'lucide-react'
import { getVans, getVanManifest } from '../services/api'

const Vans = () => {
  const [items, setItems] = React.useState([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [selectedVan, setSelectedVan] = React.useState(null)
  const [manifest, setManifest] = React.useState(null)
  const [viewingManifest, setViewingManifest] = React.useState(false)

  const fetchVans = async (pageNum) => {
    setLoading(true)
    try {
      const response = await getVans(pageNum, 10)
      setItems(response.data.items)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
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
    fetchVans(page)
  }, [page])

  return (
    <div className="space-y-8 animate-enter pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-suzuki-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <Bus size={14} /> Fleet Logistics
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Active Van Inventory</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor vehicle occupancy in real-time.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search vehicle..." className="bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none focus:ring-4 focus:ring-suzuki-blue/5 transition-all w-48" />
           </div>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-suzuki-blue hover:shadow-soft transition-all">
              <Filter size={16} />
           </button>
        </div>
      </div>

      <div className="pro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="smart-table">
            <thead>
              <tr>
                <th>Vehicle Identity</th>
                <th>Registration</th>
                <th>Assigned Driver</th>
                <th>Capacity & Occupancy</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="py-6 px-8">
                       <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : items?.map((van) => (
                <tr key={van.id} className="group">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-suzuki-blue group-hover:text-white transition-all">
                        <Bus size={20} />
                      </div>
                      <span className="font-bold text-slate-900">{van.vanNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{van.registrationNumber}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Users size={12} className="text-emerald-600" />
                       </div>
                       <span className="text-sm font-semibold text-slate-700">{van.driverName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="w-48">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {van.occupancy} / {van.capacity} Seats
                        </span>
                        <span className={`text-[10px] font-bold ${van.occupancy > van.capacity ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {Math.round((van.occupancy / van.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((van.occupancy / van.capacity) * 100, 100)}%` }}
                          className={`h-full rounded-full ${
                             van.occupancy > van.capacity ? 'bg-rose-500' : 
                             van.occupancy === van.capacity ? 'bg-amber-500' : 'bg-suzuki-blue'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      van.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {van.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleViewManifest(van)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-suzuki-blue hover:text-white text-slate-600 rounded-xl text-xs font-bold transition-all"
                    >
                      View Manifest <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Showing {items?.length || 0} of {totalCount} vehicles</p>
           <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:border-suzuki-blue hover:text-suzuki-blue transition-all"
              >
                 <ChevronLeft size={18} />
              </button>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-suzuki-blue text-white font-bold text-sm shadow-lg shadow-suzuki-blue/20">
                 {page}
              </div>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:border-suzuki-blue hover:text-suzuki-blue transition-all"
              >
                 <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Manifest Overlay */}
      <AnimatePresence>
        {viewingManifest && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setViewingManifest(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-glass overflow-hidden"
            >
              <div className="p-8 bg-[#0F172A] text-white relative">
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-2 text-suzuki-light font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                          <Bus size={12} /> Digital Manifest
                       </div>
                       <h2 className="text-3xl font-display font-black tracking-tight">{selectedVan?.vanNumber}</h2>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                          Reg: {selectedVan?.registrationNumber} · {selectedVan?.driverName}
                       </p>
                    </div>
                    <button 
                      className="w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-xl flex items-center justify-center transition-all"
                      onClick={() => setViewingManifest(false)}
                    >
                       <X className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              <div className="p-10">
                 <div className="flex items-center gap-4 mb-8 p-5 bg-primary-50 rounded-3xl border border-primary-100">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-suzuki-blue shadow-sm">
                       <Info size={24} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-suzuki-blue">Logistics Integrity Policy</p>
                       <p className="text-xs text-suzuki-blue/70">Occupancy is validated against strict gender-buffer requirements.</p>
                    </div>
                 </div>

                 <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {manifest ? (
                      manifest.assignments?.length > 0 ? (
                        manifest.assignments.map((seat, i) => (
                          <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            seat.isBufferSeat ? 'bg-slate-50 border-dashed border-slate-300 opacity-60' : 'bg-white border-slate-100 hover:shadow-soft'
                          }`}>
                            <div className="flex items-center gap-5">
                                <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                    {seat.seatNumber}
                                </span>
                                <div>
                                    {seat.isBufferSeat ? (
                                      <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                          <ShieldCheck size={14} /> GENDER BUFFER
                                      </div>
                                    ) : (
                                      <>
                                        <p className="font-bold text-slate-900 text-sm leading-tight">{seat.employeeName}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{seat.employeeCode} · {seat.gender === 'F' ? 'FEMALE' : 'MALE'}</p>
                                      </>
                                    )}
                                </div>
                            </div>
                            {!seat.isBufferSeat && (
                              <span className={`badge ${
                                seat.gender === 'F' ? 'bg-rose-50 text-rose-600' : 'bg-primary-50 text-suzuki-blue'
                              }`}>
                                  {seat.gender}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                           <p className="text-slate-400 font-bold text-sm">No employees assigned for today.</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center py-20 gap-4 opacity-40">
                         <div className="w-10 h-10 border-4 border-slate-100 border-t-suzuki-blue rounded-full animate-spin"></div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Payload</p>
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
