import React from 'react'
import { motion } from 'framer-motion'
import { Lock, User, ShieldCheck } from 'lucide-react'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await login({ username, password })
      localStorage.setItem('admin_token', response.data.token)
      localStorage.setItem('admin_user', JSON.stringify(response.data))
      navigate('/')
    } catch (err) {
      setError('Access Denied: Invalid Administrative Credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-suzuki-blue rounded-3xl mb-6 shadow-2xl shadow-blue-500/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Command Center</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Fleet Logistics Administration</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-suzuki-blue transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Username"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-suzuki-blue/5 focus:border-suzuki-blue outline-none transition-all font-medium text-sm"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-suzuki-blue transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-suzuki-blue/5 focus:border-suzuki-blue outline-none transition-all font-medium text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-suzuki-blue py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'Login'}
            </button>
          </form>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-6">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Access Only</span>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Proprietary Logistics Management System
          <br/><span className="mt-2 block">Pak Suzuki Motor Co. Ltd</span>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
