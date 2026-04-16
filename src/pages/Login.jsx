import React from 'react'
import { motion } from 'framer-motion'
import { Lock, User, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
        navigate('/', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await login({ username, password })
      const { token, refreshToken, username: userName } = response.data
      
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_refresh_token', refreshToken)
      localStorage.setItem('admin_user', JSON.stringify({ username: userName }))
      
      navigate('/')
    } catch (err) {
      setError('Access Denied: Invalid Administrative Credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#010816] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-suzuki-blue/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-0 bg-[#0F172A]/40 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Branding Panel */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-suzuki-blue to-suzuki-dark text-white relative">
           <div className="absolute inset-0 opacity-10 bg-[url('https://api.dicebear.com/7.x/identicon/svg?seed=suzuki&backgroundColor=004098')] bg-repeat"></div>
           
           <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 border border-white/20">
                 <ShieldCheck size={36} className="text-white" />
              </div>
              <h1 className="text-5xl font-display font-black tracking-tight leading-[1.1] mb-6">
                 Pickup <br/> <span className="text-suzuki-light">Admin</span>
              </h1>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed max-w-sm">
                 Manage your fleet and employees in real-time.
              </p>
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-6">
                 <div className="text-left">
                    <p className="text-2xl font-black">99.9%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200/50">Service Uptime</p>
                 </div>
                 <div className="w-px h-8 bg-white/20"></div>
                 <div className="text-left">
                    <p className="text-2xl font-black">3.5k+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200/50">Daily Transports</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-10 lg:p-16 flex flex-col justify-center bg-white/5">
           <div className="mb-10 lg:hidden">
              <h2 className="text-2xl font-display font-black text-white">Admin</h2>
           </div>

           <div className="mb-10">
              <h2 className="text-3xl font-display font-black text-white tracking-tight mb-2">Login</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to continue.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold"
               >
                 {error}
               </motion.div>
             )}

             <div className="space-y-4">
               <div className="space-y-1.5 group">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-suzuki-light transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Username"
                      required
                      className="w-full bg-[#1E293B]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-suzuki-blue/10 focus:border-suzuki-light/30 outline-none transition-all text-white text-sm"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                 </div>
               </div>

               <div className="space-y-1.5 group">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-suzuki-light transition-colors" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#1E293B]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-suzuki-blue/10 focus:border-suzuki-light/30 outline-none transition-all text-white text-sm"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                 </div>
               </div>
             </div>

             <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-suzuki-blue py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-suzuki-blue/20 hover:bg-suzuki-light active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                  {!loading && <ArrowRight size={18} />}
                </button>
             </div>
           </form>

           <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>v1.0.0</span>
              <span>Proprietary</span>
           </div>
        </div>
      </div>

      <footer className="absolute bottom-10 text-center w-full z-10">
         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">
           Pak Suzuki Motor Co. Ltd © 2026
         </p>
      </footer>
    </div>
  )
}

export default Login
