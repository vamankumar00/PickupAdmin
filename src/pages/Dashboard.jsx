import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Bus, 
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader,
  TrendingUp,
  UserCheck,
  UserX,
  RefreshCw
} from 'lucide-react'
import { getStats, runAssignment, getAssignmentStatus } from '../services/api'

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
  const [stats, setStats] = React.useState({ totalEmployees: 0, totalVans: 0, activeEmployees: 0, activeVans: 0 })
  const [assignmentStatus, setAssignmentStatus] = React.useState({ lastRunAt: null, assignedCount: 0, unassignedCount: 0, totalActive: 0 })
  const [loading, setLoading] = React.useState(true)
  const [running, setRunning] = React.useState(false)
  const [runResult, setRunResult] = React.useState(null) // { success: bool, message: string }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, statusRes] = await Promise.all([getStats(), getAssignmentStatus()])
      setStats(statsRes.data)
      setAssignmentStatus(statusRes.data)
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRunAssignment = async () => {
    setRunning(true)
    setRunResult(null)
    try {
      const res = await runAssignment()
      const data = res.data
      setRunResult({
        success: true,
        message: `Assignment complete. ${data.assignedCount} employees assigned to ${data.totalVans} vans. ${data.unassignedCount} unassigned.`
      })
      await fetchAll() // Refresh stats
    } catch (err) {
      setRunResult({
        success: false,
        message: err.response?.data?.message || 'Assignment failed. Check backend logs.'
      })
    } finally {
      setRunning(false)
    }
  }

  React.useEffect(() => {
    fetchAll()
  }, [])

  const lastRun = assignmentStatus.lastRunAt 
    ? new Date(assignmentStatus.lastRunAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
    : null

  const assignmentPct = assignmentStatus.totalActive > 0
    ? Math.round((assignmentStatus.assignedCount / assignmentStatus.totalActive) * 100)
    : 0

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-suzuki-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5">
            <TrendingUp size={14} /> Command Center
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Fleet overview and assignment controls.</p>
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
        <StatCard
          title="Total Vans"
          value={loading ? '...' : stats.totalVans.toLocaleString()}
          sub={`${stats.activeVans} active`}
          icon={<Bus className="text-emerald-600" size={24} />}
          accent="bg-emerald-50"
        />
        <StatCard
          title="Assigned"
          value={loading ? '...' : assignmentStatus.assignedCount.toLocaleString()}
          sub={lastRun ? `Last run ${lastRun}` : 'Never run'}
          icon={<UserCheck className="text-violet-600" size={24} />}
          accent="bg-violet-50"
        />
        <StatCard
          title="Unassigned"
          value={loading ? '...' : assignmentStatus.unassignedCount.toLocaleString()}
          sub="Employees without a van"
          icon={<UserX className="text-amber-600" size={24} />}
          accent="bg-amber-50"
        />
      </div>

      {/* Assignment Engine Card */}
      <div className="pro-card p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F172A] flex items-center justify-center flex-shrink-0">
                <Play size={20} className="text-suzuki-light" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-none">Assignment Engine</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Clusters employees by proximity and optimizes van pickup routes.
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {assignmentStatus.totalActive > 0 && (
              <div className="mt-4 max-w-md">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coverage</span>
                  <span className="text-[10px] font-bold text-suzuki-blue">{assignmentPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${assignmentPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-suzuki-blue rounded-full"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {assignmentStatus.assignedCount} of {assignmentStatus.totalActive} active employees assigned
                </p>
              </div>
            )}

            {lastRun && (
              <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400 font-medium">
                <Clock size={12} />
                Last run: {lastRun}
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleRunAssignment}
              disabled={running}
              className="flex items-center gap-3 px-8 py-4 bg-suzuki-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-suzuki-blue/25 hover:bg-suzuki-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {running
                ? <><Loader size={18} className="animate-spin" /> Running...</>
                : <><Play size={18} /> Run Assignment</>
              }
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
              Clears & replaces all assignments
            </p>
          </div>
        </div>

        {/* Result Banner */}
        <AnimatePresence>
          {runResult && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-4 rounded-2xl flex items-start gap-3 text-sm font-semibold ${
                runResult.success
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}
            >
              {runResult.success
                ? <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                : <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              }
              {runResult.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard
