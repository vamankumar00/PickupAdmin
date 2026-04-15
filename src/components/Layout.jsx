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

  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
    { name: 'Fleet Management', path: '/vans', icon: <Bus size={20} /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      {/* Sidebar - Smart Admin Dark Skin */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-4 px-2 mb-10">
            <div className="w-12 h-12 bg-suzuki-blue rounded-2xl flex items-center justify-center shadow-lg shadow-suzuki-blue/20 transform rotate-3 hover:rotate-0 transition-transform">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-white tracking-tight leading-none">SmartAdmin</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 block">Fleet Logistics</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
            {navItems.map((item) => (
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
            ))}
          </nav>

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
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Modern Header */}
        <header className="h-24 glass sticky top-0 z-40 px-6 lg:px-10 flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-suzuki-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Quick search records..." 
                className="w-64 lg:w-96 bg-slate-100/50 border-0 rounded-2xl py-3 pl-12 pr-4 focus:ring-4 focus:ring-suzuki-blue/5 focus:bg-white transition-all text-sm font-medium outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden md:flex items-center gap-2">
               <button className="p-3 text-slate-400 hover:text-suzuki-blue hover:bg-white rounded-2xl transition-all shadow-sm">
                  <Settings size={20} />
               </button>
               <button className="relative p-3 text-slate-400 hover:text-suzuki-blue hover:bg-white transition-all rounded-2xl shadow-sm">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
            <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-black text-slate-900 leading-none">Fleet Manager</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Control Panel</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-premium border border-slate-50">
                 <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username || 'Admin'}&backgroundColor=004098&fontFamily=Inter&fontWeight=700`} 
                    alt="avatar" 
                    className="w-full h-full object-cover rounded-xl"
                 />
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
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

        {/* Footer */}
        <footer className="px-10 py-6 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
             Pak Suzuki Motor Co. Ltd © 2026 · Proprietary Command System
           </p>
        </footer>
      </div>
    </div>
  )
}

export default Layout
