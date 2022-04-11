import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'

import { Login } from 'pages/login'

export default function UnAuthenticatedApp() {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={isProduction ? <Navigate to="/" /> : <Navigate to="/login" />} />
    </Routes>
  )
}
