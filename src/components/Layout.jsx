import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Route as RouteIcon, 
  Bus,
  LogOut, 
  Search,
  Bell,
  ChevronDown
} from 'lucide-react'

const Layout = () => {
  const navigate = useNavigate()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={18} /> },
    { name: 'Fleet', path: '/vans', icon: <Bus size={18} /> },
    { name: 'Routes', path: '/routes', icon: <RouteIcon size={18} /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/login'
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Institutional Sidebar */}
      <aside className="w-64 bg-suzuki-blue fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl">
        <div className="p-8 pb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="font-bold text-suzuki-blue text-2xl">S</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-white text-lg tracking-tight leading-none">PickupAdmin</h1>
            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">Fleet Center</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all border border-transparent
                ${isActive 
                  ? 'bg-white/10 text-white border-white/10 shadow-inner' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'}
              `}
            >
              {item.icon}
              <span className="font-semibold text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-red-500/20 transition-all font-semibold text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Corporate Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center sticky top-0 z-40">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-suzuki-blue transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Personnel Records..." 
              className="w-full bg-slate-100 border-0 rounded-lg py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-suzuki-blue/20 focus:bg-white transition-all text-sm font-medium outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-suzuki-blue transition-colors rounded-full hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-suzuki-red rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
              <div className="w-9 h-9 rounded-full bg-suzuki-blue flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/initials/svg?seed=Admin" alt="avatar" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Fleet Manager</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Superuser Access</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <section className="p-10 flex-1">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default Layout
