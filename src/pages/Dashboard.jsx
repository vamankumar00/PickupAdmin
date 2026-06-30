import React from 'react'
import { 
  Users, 
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { getStats } from '../services/api'

const StatCard = ({ title, value, sub, icon, accent }) => (
  <div className="pro-card p-7 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-display font-black text-slate-900 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 font-medium mt-1">{sub}</p>}
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = React.useState({ totalEmployees: 0, activeEmployees: 0 })
  const [loading, setLoading] = React.useState(true)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const statsRes = await getStats()
      setStats(statsRes.data)
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAll()
  }, [])

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-suzuki-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <TrendingUp size={14} /> Command Center
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">System overview.</p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-suzuki-blue transition-all shadow-soft disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Employees"
          value={loading ? '...' : stats.totalEmployees.toLocaleString()}
          sub={`${stats.activeEmployees} active`}
          icon={<Users className="text-suzuki-blue" size={24} />}
          accent="bg-suzuki-blue/10"
        />
      </div>
    </div>
  )
}

export default Dashboard
