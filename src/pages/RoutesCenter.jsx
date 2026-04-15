import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Settings, 
  Navigation, 
  ChevronRight,
  MapPin,
  ArrowRight,
  Bus as BusIcon
} from 'lucide-react'
import { getRoutes, processRoutes } from '../services/api'
import 'leaflet/dist/leaflet.css'

// Professional Teardrop Marker Factory
const createProIcon = (color, isSelected) => L.divIcon({
  html: `<div style="background-color: ${color}; width: ${isSelected ? '22px' : '14px'}; height: ${isSelected ? '22px' : '14px'}; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px ${color}66; transition: all 0.3s ease;"></div>`,
  className: 'custom-pro-marker',
  iconSize: [isSelected ? 22 : 14, isSelected ? 22 : 14],
  iconAnchor: [isSelected ? 11 : 7, isSelected ? 11 : 7]
})

const baseIcon = L.divIcon({
  html: `<div style="background-color: #004098; width: 28px; height: 28px; border: 4px solid white; border-radius: 8px; display: flex; items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,64,152,0.4);">
           <div style="width: 10px; height: 10px; background: white; border-radius: 2px;"></div>
         </div>`,
  className: 'base-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
})

const RoutesCenter = () => {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [routes, setRoutes] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [tripMode, setTripMode] = React.useState('Pickup') // 'Pickup' or 'Dropoff'
  const [selectedRouteId, setSelectedRouteId] = React.useState(null)
  
  const officeLocation = [24.814, 67.362]
  const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899']

  const fetchRoutes = async () => {
    try {
      const response = await getRoutes()
      setRoutes(response.data)
    } catch (err) {
      console.error('Failed to fetch routes', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchRoutes()
  }, [])

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      await processRoutes(tripMode)
      await fetchRoutes()
    } catch (err) {
      console.error('Route optimization failed', err)
      alert('Routing engine error.')
    } finally {
      setIsProcessing(false)
    }
  }

  const [sidebarSearch, setSidebarSearch] = React.useState('')
  const deferredSidebarSearch = React.useDeferredValue(sidebarSearch)

  // Pre-process route lines and points
  const detailedRoutes = React.useMemo(() => {
    return routes.map((route, idx) => {
      const pathPoints = route.assignments
        ?.filter(a => a.employee)
        .sort((a, b) => a.seatNumber - b.seatNumber)
        .map(a => [a.employee.latitude, a.employee.longitude]) || []

      // Add HQ to the start or end based on mode
      const fullPath = tripMode === 'Pickup' 
        ? [...pathPoints, officeLocation] 
        : [officeLocation, ...pathPoints]

      return {
        ...route,
        color: colors[idx % colors.length],
        pathPoints: fullPath,
        employeePoints: pathPoints
      }
    })
  }, [routes, tripMode])

  const filteredRoutes = React.useMemo(() => {
    if (!deferredSidebarSearch) return detailedRoutes
    const searchLow = deferredSidebarSearch.toLowerCase()
    return detailedRoutes.filter(r => 
      r.routeName.toLowerCase().includes(searchLow) || 
      r.assignments?.some(a => a.employee?.name?.toLowerCase().includes(searchLow) || a.employee?.employeeCode?.toLowerCase().includes(searchLow))
    )
  }, [detailedRoutes, deferredSidebarSearch])

  return (
    <div className="space-y-6 fade-in h-[calc(100vh-140px)] flex flex-col font-sans pb-4">
      
      {/* Structural Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">
            <Target size={14} className="text-suzuki-blue" /> Fleet Logistics
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Van Routes</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Trip Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shadow-inner">
            {['Pickup', 'Dropoff'].map(mode => (
              <button
                key={mode}
                onClick={() => setTripMode(mode)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  tripMode === mode 
                  ? 'bg-white text-suzuki-blue shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className={`px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-md active:scale-95 border
              ${isProcessing ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-suzuki-blue text-white border-blue-800 hover:bg-blue-800'}`}
          >
            {isProcessing ? 'OPTIMIZING...' : `GENERATE ${tripMode.toUpperCase()}'S`}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Tactical Map Container */}
        <div className="lg:col-span-3 pro-card overflow-hidden relative shadow-lg">
          
          <AnimatePresence>
            {(isProcessing || loading) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[1001] bg-white/70 backdrop-blur-[4px] flex items-center justify-center"
              >
                 <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-100 border-t-suzuki-blue rounded-full animate-spin"></div>
                      <Navigation size={24} className="absolute inset-0 m-auto text-suzuki-blue animate-pulse" />
                    </div>
                    <p className="text-xs font-black text-slate-700 tracking-[0.2em] uppercase">
                      {isProcessing ? 'CALCULATING BEST ROUTES' : 'SYNCING MAP DATA'}
                    </p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <MapContainer 
            center={officeLocation} 
            zoom={13} 
            zoomControl={true}
            style={{ height: '100%', width: '100%', background: '#f8fafc' }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            <Marker position={officeLocation} icon={baseIcon}>
              <Popup className="pro-popup">
                <div className="p-1 font-bold text-suzuki-blue text-xs uppercase">Suzuki HQ</div>
              </Popup>
            </Marker>

            {detailedRoutes.map(route => {
              const isSelected = selectedRouteId === route.id;
              // If sidebar is filtering, only show selected or if it matches filter
              const isMatch = filteredRoutes.some(fr => fr.id === route.id);
              if (!isMatch && !isSelected) return null;

              return (
                <React.Fragment key={route.id}>
                  {/* Route Polyline (Simplified for massive scale) */}
                  <Polyline 
                    positions={route.pathPoints} 
                    pathOptions={{ 
                      color: route.color, 
                      weight: isSelected ? 6 : (selectedRouteId ? 1 : 2),
                      opacity: isSelected ? 1 : (selectedRouteId ? 0.1 : 0.4),
                      lineCap: 'round',
                      dashArray: isSelected ? null : '10, 10'
                    }} 
                  />
                  
                  {/* Detailed Employee Markers (Only for Selected Route for performance) */}
                  {(isSelected || detailedRoutes.length < 20) && route.employeePoints.map((pos, pidx) => (
                    <Marker 
                      key={`${route.id}-${pidx}`} 
                      position={pos} 
                      icon={createProIcon(route.color, isSelected)}
                      opacity={isSelected ? 1 : 0.6}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1 text-sm">{route.routeName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {tripMode === 'Pickup' ? 'Stop' : 'Drop'} #{pidx + 1}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              )
            })}
          </MapContainer>

          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur px-5 py-3 border border-slate-200 rounded-2xl shadow-xl">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-suzuki-blue rounded"></div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Suzuki Headquarters</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-0.5 bg-slate-400">---</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Paths</span>
               </div>
            </div>
          </div>
        </div>

        {/* Tactical Manifest Sidebar */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="px-1 border-b border-slate-200 pb-4 flex flex-col gap-4">
             <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Van List</h3>
                  <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-wider">
                    Current {tripMode}
                  </p>
                </div>
                <div className="bg-suzuki-blue/10 text-suzuki-blue text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                    {filteredRoutes.length} Shown
                </div>
             </div>
             
             {/* Sidebar Search */}
             <div className="relative group">
                <Settings size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-suzuki-blue transition-colors" />
                <input 
                  type="text"
                  placeholder="Filter Van or Employee..."
                  className="w-full bg-slate-100 border-none rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold outline-none focus:ring-2 focus:ring-suzuki-blue/20 transition-all placeholder:text-slate-400"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                />
             </div>
          </div>
          
          {filteredRoutes.map((route, i) => (
            <motion.div 
              key={route.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i < 20 ? i * 0.05 : 0 }} // Only animate first 20 for performance
              onClick={() => setSelectedRouteId(selectedRouteId === route.id ? null : route.id)}
              className={`pro-card p-5 group cursor-pointer transition-all border-l-4 relative overflow-hidden
                ${selectedRouteId === route.id ? 'ring-2 ring-suzuki-blue ring-offset-2' : 'hover:border-slate-300'}`}
              style={{ borderLeftColor: route.color }}
            >
              {selectedRouteId === route.id && (
                <div className="absolute top-0 right-0 p-1 bg-suzuki-blue text-white rounded-bl-xl shadow-lg">
                   <Target size={12} />
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className={`font-bold text-sm transition-colors ${selectedRouteId === route.id ? 'text-suzuki-blue' : 'text-slate-900'}`}>
                     {route.routeName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                     <BusIcon size={12} className="text-slate-400" />
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                        {route.assignments?.filter(a => a.employeeId).length} Employees
                     </p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg transition-colors ${selectedRouteId === route.id ? 'bg-suzuki-blue text-white' : 'bg-slate-50 text-slate-300 group-hover:text-suzuki-blue'}`}>
                   <ArrowRight size={14} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                   <span>Unit Capacity</span>
                   <span className="text-slate-900 font-extrabold">{route.assignments?.length} / 10 Units</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(route.assignments?.length/10)*100}%` }}
                     transition={{ duration: 0.8 }}
                     className="h-full bg-suzuki-blue" 
                   />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoutesCenter
