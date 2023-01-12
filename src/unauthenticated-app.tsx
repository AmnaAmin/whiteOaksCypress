import './App.css'
import { Route, Routes } from 'react-router-dom'

import { Login } from 'pages/vendor/login'
import { VendorRegister } from 'pages/vendor/register'

export default function UnAuthenticatedApp() {
  // const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}
