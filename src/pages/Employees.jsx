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
  Download,
  Upload,
  Bus,
  X,
  UserPlus,
  Briefcase
} from 'lucide-react'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, importEmployees, getSampleExcel } from '../services/api'

const Employees = () => {
  const [items, setItems] = React.useState([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showEnrollModal, setShowEnrollModal] = React.useState(false)

  const [editingEmployee, setEditingEmployee] = React.useState(null)

  // Enrollment Form State
  const [newEmp, setNewEmp] = React.useState({
    name: '',
    employeeCode: '',
    gender: 'M',
    department: '',
    address: ''
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
      setPage(1)
      fetchEmployees(1, searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  React.useEffect(() => {
    if (page !== 1) {
      fetchEmployees(page, searchTerm)
    }
  }, [page])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, newEmp)
      } else {
        await createEmployee(newEmp)
      }
      setShowEnrollModal(false)
      setNewEmp({ name: '', employeeCode: '', gender: 'M', department: '', address: '' })
      setEditingEmployee(null)
      fetchEmployees(page, searchTerm) 
    } catch (err) {
      alert('Failed to save employee. Code must be unique.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Change status of this employee?')) return
    try {
      await deleteEmployee(id)
      fetchEmployees(page, searchTerm)
    } catch (err) {
      alert('Operation failed.')
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
      alert('Import failed. Please check Excel format.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadSample = async () => {
    try {
      await getSampleExcel()
    } catch (err) {
      alert('Failed to download sample file.')
    }
  }

  return (
    <div className="space-y-8 animate-enter pb-12">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-suzuki-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <Briefcase size={14} /> Staff
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Employees</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your staff records.</p>
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
            onClick={() => { setEditingEmployee(null); setNewEmp({ name: '', employeeCode: '', gender: 'M', department: '', address: '' }); setShowEnrollModal(true); }}
            className="px-6 py-3 bg-suzuki-blue text-white rounded-2xl flex items-center gap-2 text-xs font-bold transition-all hover:bg-suzuki-dark shadow-xl shadow-suzuki-blue/20"
          >
            <Plus size={18} /> Add Employee
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
              placeholder="Search..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-14 pr-6 focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
               <p className="text-xl font-display font-black text-slate-900">{totalCount}</p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-suzuki-blue transition-all shadow-soft">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="smart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee Code</th>
                <th>Department</th>
                <th>Van</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan="6" className="py-8 px-8">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                     </td>
                  </tr>
                ))
               ) : items.map((emp) => (
                <tr key={emp.id} className={`group ${emp.status === 'Inactive' ? 'opacity-50 grayscale bg-slate-50/50' : ''}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`badge ${
                            emp.gender === 'F' ? 'bg-rose-50 text-rose-500' : 'bg-primary-50 text-suzuki-blue'
                          }`}>
                            {emp.gender === 'F' ? 'Female' : 'Male'}
                          </span>
                          <span className={`badge ${
                            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {emp.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      {emp.employeeCode}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-slate-600">{emp.department}</span>
                  </td>
                  <td>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit ${
                       emp.assignedVan ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                       <Bus size={12} />
                       <span className="text-[10px] font-black uppercase tracking-tighter">{emp.assignedVan || 'Pending'}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => { setEditingEmployee(emp); setNewEmp(emp); setShowEnrollModal(true); }}
                         className="p-2.5 bg-slate-50 text-slate-400 hover:text-suzuki-blue hover:bg-slate-100 rounded-xl transition-all"
                       >
                         <Briefcase size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(emp.id)}
                         className={`p-2.5 rounded-xl transition-all ${
                           emp.status === 'Active' 
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

      {/* Enrollment Modal */}
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
               onClick={() => setShowEnrollModal(false)}
             />
             <motion.div 
               initial={{ y: 20, opacity: 0, scale: 0.95 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: 20, opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-glass overflow-hidden"
             >
                <div className="p-10 bg-[#0F172A] text-white flex justify-between items-center">
                   <div>
                      <div className="flex items-center gap-2 text-suzuki-light font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                        <UserPlus size={14} /> {editingEmployee ? 'Record Management' : 'Enrollment'}
                      </div>
                      <h2 className="text-3xl font-display font-black tracking-tight">{editingEmployee ? 'Update Profile' : 'New Employee'}</h2>
                   </div>
                   <button onClick={() => setShowEnrollModal(false)} className="w-12 h-12 bg-white/10 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center transition-all">
                      <X size={24} />
                   </button>
                </div>
                <form onSubmit={handleSave} className="p-10 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Full Name</label>
                         <input 
                           required
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all" 
                           placeholder="e.g. John Doe"
                           value={newEmp.name}
                           onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Employee ID</label>
                         <input 
                           required 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all"
                           placeholder="e.g. PS-1234"
                           value={newEmp.employeeCode}
                           onChange={e => setNewEmp({...newEmp, employeeCode: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Gender</label>
                         <select 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all appearance-none"
                           value={newEmp.gender}
                           onChange={e => setNewEmp({...newEmp, gender: e.target.value})}
                         >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Department</label>
                         <input 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all"
                           placeholder="e.g. Production"
                           value={newEmp.department}
                           onChange={e => setNewEmp({...newEmp, department: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Address</label>
                        <input 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-suzuki-blue/5 outline-none transition-all"
                          placeholder="Primary residential address"
                          value={newEmp.address}
                          onChange={e => setNewEmp({...newEmp, address: e.target.value})}
                        />
                   </div>

                   <div className="pt-4">
                      <button type="submit" className="w-full py-4 bg-suzuki-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-suzuki-blue/20 hover:bg-suzuki-dark transition-all transform active:scale-[0.98]">
                        {editingEmployee ? 'Update Records' : 'Save Employee'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Employees
