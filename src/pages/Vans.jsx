import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bus, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Search,
  Filter,
  X,
  Download,
  Upload,
  Plus,
  Briefcase,
  Route,
  ListChecks,
  MapPin,
  ArrowDown,
  ArrowUp,
  Circle
} from 'lucide-react'
import { 
  getVans, 
  createVan, 
  updateVan, 
  deleteVan, 
  importVans, 
  getVanSampleExcel,
  getVanEmployees,
  getVanRoute
} from '../services/api'

const Vans = () => {
  const [items, setItems] = React.useState([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')

  // Modal state
  const [showModal, setShowModal] = React.useState(false)
  const [editingVan, setEditingVan] = React.useState(null)
  const [newVan, setNewVan] = React.useState({ vanNumber: '', registrationNumber: '', driverName: '', capacity: 15 })

  // Employees modal state
  const [showEmpModal, setShowEmpModal] = React.useState(false)
  const [empModalVan, setEmpModalVan] = React.useState(null)
  const [empModalData, setEmpModalData] = React.useState([])
  const [empModalLoading, setEmpModalLoading] = React.useState(false)

  // Route modal state
  const [showRouteModal, setShowRouteModal] = React.useState(false)
  const [routeModalVan, setRouteModalVan] = React.useState(null)
  const [routeModalData, setRouteModalData] = React.useState(null)
  const [routeModalLoading, setRouteModalLoading] = React.useState(false)

  const fetchVans = async (pageNum, searchVal = '') => {
    setLoading(true)
    try {
      const response = await getVans(pageNum, 10, searchVal)
      setItems(response.data.items)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
    } catch (err) {
      console.error('Failed to fetch fleet data', err)
    } finally {
      setLoading(false)
    }
  }

  // Debounced Search Logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchVans(1, searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  React.useEffect(() => {
    if (page !== 1) {
      fetchVans(page, searchTerm)
    }
  }, [page])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingVan) {
        await updateVan(editingVan.id, newVan)
      } else {
        await createVan(newVan)
      }
      setShowModal(false)
      setNewVan({ vanNumber: '', registrationNumber: '', driverName: '', capacity: 15 })
      setEditingVan(null)
      fetchVans(page, searchTerm)
    } catch (err) {
      alert('Operation failed. Check if Van Number is unique.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Change status of this vehicle?')) return
    try {
      await deleteVan(id)
      fetchVans(page, searchTerm)
    } catch (err) {
      alert('Operation failed.')
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    try {
      await importVans(file)
      alert('Vans imported successfully.')
      fetchVans(1, '')
    } catch (err) {
      alert('Import failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadSample = async () => {
    try {
      await getVanSampleExcel()
    } catch (err) {
      alert('Failed to download sample.')
    }
  }

  const handleOpenEmpModal = async (van) => {
    setEmpModalVan(van)
    setShowEmpModal(true)
    setEmpModalLoading(true)
    try {
      const res = await getVanEmployees(van.id)
      setEmpModalData(res.data.employees || [])
    } catch {
      setEmpModalData([])
    } finally {
      setEmpModalLoading(false)
    }
  }

  const handleOpenRouteModal = async (van) => {
    setRouteModalVan(van)
    setShowRouteModal(true)
    setRouteModalLoading(true)
    try {
      const res = await getVanRoute(van.id)
      setRouteModalData(res.data)
    } catch {
      setRouteModalData(null)
    } finally {
      setRouteModalLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-enter pb-12">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-suzuki-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <Bus size={14} /> Fleet Management
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Vans</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and track your vehicle fleet.</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <button 
             onClick={handleDownloadSample}
             className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all hover:bg-slate-50 shadow-soft"
           >
              <Download size={16} className="text-suzuki-blue" /> Sample File
           </button>
           <label className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all hover:bg-slate-50 shadow-soft cursor-pointer">
              <Upload size={16} className="text-emerald-500" /> Import
              <input type="file" className="hidden" accept=".xlsx" onChange={handleImport} />
           </label>
           <button 
             onClick={() => { setEditingVan(null); setNewVan({ vanNumber: '', registrationNumber: '', driverName: '', capacity: 15 }); setShowModal(true); }}
             className="px-6 py-3 bg-suzuki-blue text-white rounded-2xl flex items-center gap-2 text-xs font-bold transition-all hover:bg-suzuki-dark shadow-xl shadow-suzuki-blue/20"
           >
             <Plus size={18} /> Add Van
           </button>
        </div>
      </div>

      <div className="pro-card overflow-hidden">
        {/* Search & Stats Header */}
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative group w-full lg:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-suzuki-blue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-14 pr-6 focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fleet</p>
               <p className="text-xl font-display font-black text-slate-900">{totalCount}</p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-suzuki-blue transition-all shadow-soft">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="smart-table">
            <thead>
              <tr>
                <th>Van Details</th>
                <th>Registration</th>
                <th>Driver</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="py-6 px-8">
                       <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : items?.map((van) => (
                <tr key={van.id} className={`group ${van.status === 'Inactive' ? 'opacity-50 grayscale bg-slate-50/50' : ''}`}>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-soft border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-suzuki-blue group-hover:text-white transition-all">
                        <Bus size={20} />
                      </div>
                      <span className="font-bold text-slate-900">{van.vanNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      {van.registrationNumber}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-semibold text-slate-600">{van.driverName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      van.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {van.status || 'Active'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEmpModal(van)}
                        title="View assigned employees"
                        className="p-2.5 bg-violet-50 text-violet-500 hover:bg-violet-100 rounded-xl transition-all"
                      >
                        <Users size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenRouteModal(van)}
                        title="View pickup route"
                        className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-xl transition-all"
                      >
                        <Route size={16} />
                      </button>
                      <button 
                        onClick={() => { setEditingVan(van); setNewVan(van); setShowModal(true); }}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-suzuki-blue hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <Briefcase size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(van.id)}
                        className={`p-2.5 rounded-xl transition-all ${
                          van.status === 'Active' 
                          ? 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Page {page} of {totalPages}</p>
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-glass overflow-hidden"
            >
              <div className="p-10 bg-[#0F172A] text-white flex justify-between items-center">
                 <div>
                    <div className="flex items-center gap-2 text-suzuki-light font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                       <Bus size={12} /> {editingVan ? 'Modify' : 'Identify'}
                    </div>
                    <h2 className="text-3xl font-display font-black tracking-tight">
                       {editingVan ? 'Update Van' : 'New Van'}
                    </h2>
                 </div>
                 <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-white/10 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center transition-all">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Van Number</label>
                       <input 
                         required
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all" 
                         placeholder="e.g. V-001"
                         value={newVan.vanNumber}
                         onChange={e => setNewVan({...newVan, vanNumber: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration</label>
                       <input 
                         required 
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all"
                         placeholder="e.g. ABC-123"
                         value={newVan.registrationNumber}
                         onChange={e => setNewVan({...newVan, registrationNumber: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Driver Name</label>
                       <input 
                         required
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all" 
                         placeholder="Full Name"
                         value={newVan.driverName}
                         onChange={e => setNewVan({...newVan, driverName: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                       <input 
                         type="number"
                         required 
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all"
                         value={newVan.capacity}
                         onChange={e => setNewVan({...newVan, capacity: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>

                 <div className="pt-4">
                    <button type="submit" className="w-full py-4 bg-suzuki-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-suzuki-blue/20 hover:bg-suzuki-dark transition-all transform active:scale-[0.98]">
                      {editingVan ? 'Update Record' : 'Enroll Vehicle'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employees Modal */}
      <AnimatePresence>
        {showEmpModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowEmpModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-glass overflow-hidden max-h-[85vh] flex flex-col">
              <div className="p-8 bg-[#0F172A] text-white flex justify-between items-center flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 text-violet-300 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
                    <ListChecks size={12} /> Assigned Employees
                  </div>
                  <h2 className="text-2xl font-display font-black tracking-tight">{empModalVan?.vanNumber}</h2>
                  <p className="text-slate-400 text-xs mt-1">Driver: {empModalVan?.driverName} · Capacity: {empModalVan?.capacity}</p>
                </div>
                <button onClick={() => setShowEmpModal(false)} className="w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto custom-scrollbar flex-1">
                {empModalLoading ? (
                  <div className="p-12 text-center text-slate-400 font-semibold">Loading...</div>
                ) : empModalData.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users size={40} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-semibold text-sm">No employees assigned yet.</p>
                    <p className="text-slate-300 text-xs mt-1">Run Assignment from the Dashboard first.</p>
                  </div>
                ) : (
                  <table className="smart-table">
                    <thead><tr>
                      <th className="w-12">#</th>
                      <th>Employee</th>
                      <th>Code</th>
                      <th>Gender</th>
                      <th>Department</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {empModalData.map(emp => (
                        <tr key={emp.employeeId}>
                          <td><span className="w-7 h-7 rounded-xl bg-suzuki-blue/10 text-suzuki-blue text-[11px] font-black flex items-center justify-center">{emp.pickupOrder}</span></td>
                          <td><p className="font-bold text-slate-900 text-sm">{emp.name}</p><p className="text-xs text-slate-400">{emp.address}</p></td>
                          <td><span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{emp.employeeCode}</span></td>
                          <td><span className={`badge ${emp.gender === 'F' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>{emp.gender === 'F' ? 'Female' : 'Male'}</span></td>
                          <td><span className="text-sm text-slate-600">{emp.department}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Route Modal */}
      <AnimatePresence>
        {showRouteModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowRouteModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-glass overflow-hidden max-h-[85vh] flex flex-col">
              <div className="p-8 bg-[#0F172A] text-white flex justify-between items-center flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 text-blue-300 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
                    <Route size={12} /> Pickup Route
                  </div>
                  <h2 className="text-2xl font-display font-black tracking-tight">{routeModalVan?.vanNumber}</h2>
                  <p className="text-slate-400 text-xs mt-1">{routeModalData?.totalStops || 0} stops · Morning route (reverse for evening)</p>
                </div>
                <button onClick={() => setShowRouteModal(false)} className="w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
                {routeModalLoading ? (
                  <div className="p-8 text-center text-slate-400 font-semibold">Loading route...</div>
                ) : !routeModalData || !routeModalData.morningRoute?.length ? (
                  <div className="p-8 text-center">
                    <MapPin size={36} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-semibold text-sm">No route generated yet.</p>
                    <p className="text-slate-300 text-xs mt-1">Run Assignment from the Dashboard first.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ArrowDown size={12} /> Morning Pickup Order</p>
                    {routeModalData.morningRoute.map((stop, idx) => (
                      <div key={stop.employeeId} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-xl bg-suzuki-blue text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">{stop.stop}</div>
                          {idx < routeModalData.morningRoute.length - 1 && <div className="w-px h-6 bg-slate-200 mt-1" />}
                        </div>
                        <div className="pb-4">
                          <p className="font-bold text-slate-900 text-sm leading-tight">{stop.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{stop.address || stop.employeeCode}</p>
                          <span className={`badge mt-1 inline-block ${stop.gender === 'F' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                            {stop.gender === 'F' ? 'Female' : 'Male'}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} />
                      </div>
                      <p className="font-black text-emerald-700 text-sm">Head Office (Final Destination)</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Vans
