import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Vans from './pages/Vans'
import Login from './pages/Login'

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('admin_token')
  const location = window.location.pathname
  
  if (!token) {
    console.log('[Auth] No token found. Redirecting to login.')
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="vans" element={<Vans />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
