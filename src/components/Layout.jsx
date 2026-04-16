import React from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Bus,
  LogOut, 
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Settings
} from 'lucide-react'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}')

  const [isEmpMgmtOpen, setIsEmpMgmtOpen] = React.useState(location.pathname.startsWith('/employees'))

  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { 
      name: 'Employee Management', 
      type: 'group',
      icon: <Users size={20} />,
      children: [
        { name: 'Employees', path: '/employees', icon: <Users size={18} /> },
        // Future links like 'Departments' can go here
      ]
    },
    { name: 'Fleet Management', path: '/vans', icon: <Bus size={20} /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Smart Admin Dark Skin */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Brand Logo - Fixed at top of sidebar */}
        <div className="p-6">
          <div className="flex items-center gap-4 px-2 mb-10">
            <div className="w-12 h-12 bg-suzuki-blue rounded-2xl flex items-center justify-center shadow-lg shadow-suzuki-blue/20 transform rotate-3 hover:rotate-0 transition-transform">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-white tracking-tight leading-none">SmartAdmin</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 block">Fleet Logistics</span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-6">
          <nav className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
            {navItems.map((item) => (
              item.type === 'group' ? (
                <div key={item.name} className="space-y-1">
                   <button 
                     onClick={() => setIsEmpMgmtOpen(!isEmpMgmtOpen)}
                     className={`
                       w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group
                       ${isEmpMgmtOpen ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                     `}
                   >
                     <div className="flex items-center gap-4">
                        <span className={`${isEmpMgmtOpen ? 'text-suzuki-light' : 'group-hover:text-suzuki-light'} transition-colors`}>
                          {item.icon}
                        </span>
                        <span className="font-semibold text-[14px]">{item.name}</span>
                     </div>
                     <ChevronDown size={14} className={`transition-transform duration-300 ${isEmpMgmtOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   <AnimatePresence>
                     {isEmpMgmtOpen && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden pl-4 space-y-1"
                       >
                         {item.children.map(child => (
                            <NavLink
                              key={child.name}
                              to={child.path}
                              className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group
                                ${isActive 
                                  ? 'bg-suzuki-blue text-white shadow-xl shadow-suzuki-blue/20' 
                                  : 'text-slate-500 hover:text-white hover:bg-white/5'}
                              `}
                            >
                              <span className="font-semibold text-[13px]">{child.name}</span>
                            </NavLink>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                    ${isActive 
                      ? 'bg-suzuki-blue text-white shadow-xl shadow-suzuki-blue/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <span className={`${location.pathname === item.path ? 'text-white' : 'group-hover:text-suzuki-light'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="font-semibold text-[14px]">{item.name}</span>
                </NavLink>
              )
            ))}
          </nav>
        </div>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="bg-slate-800/40 rounded-3xl p-4 mb-4 border border-slate-700/50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-suzuki-blue to-suzuki-light flex items-center justify-center text-white font-bold text-xs">
                     ADM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{user.username || 'Administrator'}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">System Controller</p>
                  </div>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all font-bold text-sm"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Content Viewport - No header, starts from top */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <main className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
             <AnimatePresence mode="wait">
               <motion.div
                 key={location.pathname}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3, ease: 'easeOut' }}
               >
                 <Outlet />
               </motion.div>
             </AnimatePresence>
          </main>

          {/* Footer - Inside scroll area so it moves with content */}
          <footer className="px-10 py-8 text-center border-t border-slate-100 bg-slate-50/30">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
               Pak Suzuki Motor Co. Ltd © 2026 · Proprietary Command System
             </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Layout
