import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users,
  Search, 
  Filter, 
  MoreVertical, 
  Plus,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bus,
  X
} from 'lucide-react'
import { getEmployees, createEmployee } from '../services/api'

const Employees = () => {
  const [items, setItems] = React.useState([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showEnrollModal, setShowEnrollModal] = React.useState(false)

  // Enrollment Form State
  const [newEmp, setNewEmp] = React.useState({
    name: '',
    employeeCode: '',
    gender: 'M',
    department: '',
    route: ''
  })

  const fetchEmployees = async (pageNum, searchVal = '') => {
    setLoading(true)
    try {
      const response = await getEmployees(pageNum, 10, searchVal)
      setItems(response.data.items)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
    } catch (err) {
      console.error('Failed to fetch employees', err)
    } finally {
      setLoading(false)
    }
  }

  // Debounced Search Logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1) // Reset to first page on search
      fetchEmployees(1, searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  React.useEffect(() => {
    if (page !== 1) {
      fetchEmployees(page, searchTerm)
    }
  }, [page])

  const handleEnroll = async (e) => {
    e.preventDefault()
    try {
      await createEmployee(newEmp)
      setShowEnrollModal(false)
      setNewEmp({ name: '', employeeCode: '', gender: 'M', department: '', route: '' })
      fetchEmployees(page, searchTerm) 
    } catch (err) {
      alert('Failed to enroll employee. Please verify code uniqueness.')
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setLoading(true)
    try {
      await importEmployees(file)
      alert('Bulk import successful')
      fetchEmployees(1, '')
    } catch (err) {
      alert('Import failed. Please check CSV format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 fade-in pb-12 font-sans">
      {/* Structural Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <TableIcon size={14} className="text-suzuki-blue" /> Administrative Database
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h2>
        </div>
        <div className="flex gap-3">
          <label className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg flex items-center gap-2 text-xs font-bold transition-all hover:bg-slate-50 shadow-sm cursor-pointer active:scale-95">
            <ExternalLink size={16} /> Bulk Import
            <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleImport} />
          </label>
          <button 
            onClick={() => setShowEnrollModal(true)}
            className="px-5 py-2.5 bg-suzuki-blue text-white rounded-lg flex items-center gap-2 text-xs font-bold transition-all hover:bg-blue-800 shadow-md active:scale-95"
          >
            <Plus size={16} /> Enroll Individual
          </button>
        </div>
      </div>

      <div className="pro-card transition-none hover:shadow-none hover:border-slate-200 overflow-hidden">
        {/* Filtering & Search Header */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-suzuki-blue transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Identity, Code, or Sector..." 
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-12 pr-4 focus:ring-4 focus:ring-suzuki-blue/5 focus:border-suzuki-blue/40 transition-all text-sm font-medium outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-suzuki-blue transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none self-center">Showing page {page} of {totalPages}</p>
          </div>
        </div>

        {/* Institutional Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Route</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Van</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 relative">
              {loading ? (
                <tr>
                   <td colSpan="6" className="py-20 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-suzuki-blue rounded-full animate-spin"></div>
                   </td>
                </tr>
              ) : items.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shadow-sm overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${emp.name}`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase border-l-2 border-suzuki-blue pl-2">{emp.employeeCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-slate-600">{emp.department}</span>
                       <span className={`text-[9px] font-bold w-fit px-2 py-0.5 rounded border ${
                         emp.gender === 'F' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-suzuki-blue border-blue-100'
                       } uppercase tracking-tighter`}>ACTIVE</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-suzuki-blue opacity-40"></div>
                       <span className="text-xs font-semibold text-slate-700">{emp.route || 'Not Defined'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg w-fit">
                       <Bus size={12} className="text-suzuki-blue" />
                       <span className="text-[10px] font-bold text-slate-600 uppercase">{emp.assignedVan || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Institutional Pagination Footer */}
        <div className="p-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Displaying {items.length} of {totalCount} records</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:text-suzuki-blue hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
            >
               <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
               <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-suzuki-blue shadow-sm">{page}</button>
            </div>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:text-suzuki-blue hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
            >
               <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               onClick={() => setShowEnrollModal(false)}
             />
             <motion.div 
               initial={{ y: 20, opacity: 0, scale: 0.95 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: 20, opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
             >
                <div className="p-8 bg-slate-900 flex justify-between items-center">
                   <h2 className="text-xl font-bold text-white tracking-tight">Enroll New Employee</h2>
                   <button onClick={() => setShowEnrollModal(false)} className="text-white/40 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                </div>
                <form onSubmit={handleEnroll} className="p-8 space-y-5">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                         <input 
                           required
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none" 
                           value={newEmp.name}
                           onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Code</label>
                         <input 
                           required 
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none"
                           value={newEmp.employeeCode}
                           onChange={e => setNewEmp({...newEmp, employeeCode: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                         <select 
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none"
                           value={newEmp.gender}
                           onChange={e => setNewEmp({...newEmp, gender: e.target.value})}
                         >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                         <input 
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none"
                           value={newEmp.department}
                           onChange={e => setNewEmp({...newEmp, department: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Route / Sector</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none"
                        value={newEmp.route}
                        onChange={e => setNewEmp({...newEmp, route: e.target.value})}
                        placeholder="e.g. Sector-A"
                      />
                   </div>

                   <button type="submit" className="w-full py-4 bg-suzuki-blue text-white rounded-xl font-bold text-sm shadow-xl hover:bg-blue-800 transition-all mt-4">
                      Complete Enrollment
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Employees
