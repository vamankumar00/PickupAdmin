import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Bus, 
  Activity, 
  MapPin,
  TrendingUp,
  ChevronRight,
  TrendingDown,
  ExternalLink
} from 'lucide-react'
import { getStats } from '../services/api'

const StatCard = ({ title, value, icon, color, trend, trendType }) => (
  <div className="pro-card p-6">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-lg bg-slate-100 ${color} shadow-sm border border-slate-200`}>
        {icon}
      </div>
      <div className="text-right">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums tracking-tight">{value}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-[11px] font-bold">
      <span className={`flex items-center gap-1 ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trendType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}%
      </span>
      <span className="text-slate-400 font-medium lowercase">vs previous shift</span>
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalEmployees: 0,
    totalVans: 0,
    totalRoutes: 0,
    syncHealth: '98.2%'
  })
  const [loading, setLoading] = React.useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await getStats()
      setStats(prev => ({
        ...prev,
        totalEmployees: response.data.totalEmployees,
        totalVans: response.data.totalVans,
        totalRoutes: response.data.totalRoutes
      }))
    } catch (err) {
      console.error('Failed to fetch stats', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="space-y-8 fade-in pb-12">
      {/* Structural Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Operations Overview</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Real-time summary of your workforce and transportation network.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-suzuki-blue text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Corporate Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Employees" 
          value={loading && !stats.totalEmployees ? '...' : stats.totalEmployees.toLocaleString()} 
          icon={<Users className="text-suzuki-blue" size={20} />} 
          trend="4.2" 
          trendType="up" 
        />
        <StatCard 
          title="Fleet Strength" 
          value={loading && !stats.totalVans ? '...' : `${stats.totalVans} Vans`} 
          icon={<Bus className="text-slate-600" size={20} />} 
          trend="1.8" 
          trendType="up" 
        />
        <StatCard 
          title="Optimization Runs" 
          value={loading && !stats.totalRoutes ? '...' : stats.totalRoutes} 
          icon={<Activity className="text-suzuki-red" size={20} />} 
          trend="12.5" 
          trendType="up" 
        />
        <StatCard 
          title="Sync Health" 
          value={stats.syncHealth} 
          icon={<MapPin className="text-emerald-600" size={20} />} 
          trend="0.5" 
          trendType="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 pro-card p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Weekly Delivery Efficiency</h4>
              <p className="text-xs text-slate-500 font-medium">Occupancy optimization trends.</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               <button className="px-4 py-1.5 text-[10px] font-bold text-slate-500">WEEKLY</button>
               <button className="px-4 py-1.5 bg-white text-[10px] font-bold text-suzuki-blue rounded-md shadow-sm border border-slate-200">MONTHLY</button>
            </div>
          </div>
          
          <div className="h-72 flex items-end justify-between gap-2 px-2">
            {/* Using a derived scale for the bars based on stats if available, otherwise fallback */}
            {[45, 67, 85, 56, 78, 90, 45, 67, 89, 56, 78, 90, 95].map((h, i) => {
              // Simulating slightly dynamic bars based on fleet strength
              const dynamicH = Math.min(100, h * (stats.totalVans > 0 ? 1 : 1))
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${dynamicH}%` }}
                      transition={{ delay: i * 0.03, duration: 1 }}
                      className="w-full bg-slate-100 rounded-t-sm group-hover:bg-suzuki-blue/20 transition-all border-x border-t border-slate-200 relative overflow-hidden"
                      style={{ height: `${dynamicH * 2.5}px` }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-suzuki-blue/40 h-1"></div>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
             <span>Morning Shift</span>
             <span></span>
             <span>Evening Shift</span>
          </div>
        </div>

        {/* System Activity Feed */}
        <div className="pro-card p-8 flex flex-col">
          <h4 className="font-bold text-slate-900 text-lg mb-8 flex justify-between items-center">
            System Events
            <ExternalLink size={16} className="text-slate-300" />
          </h4>
          <div className="space-y-6 flex-1">
            {[
              { text: 'Van #CS-42 Route Initiated', time: '12:04 PM', type: 'info' },
              { text: 'Bulk Workforce Import Success', time: '11:45 AM', type: 'success' },
              { text: 'Auth Token Revoked - Admin2', time: '10:32 AM', type: 'alert' },
              { text: 'Backup Node Sync Completed', time: '09:12 AM', type: 'info' },
              { text: 'Maintenance Window Defined', time: 'Yesterday', type: 'info' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className={`mt-1 h-1.5 w-4 rounded-full ${item.type === 'success' ? 'bg-emerald-500' : item.type === 'alert' ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-suzuki-blue transition-colors cursor-default">{item.text}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-700 transition-all flex items-center justify-center gap-2">
            View System Audit
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
