import './App.css'
import { Route, Routes } from 'react-router-dom'

import { Login } from 'pages/vendor/login'

export default function UnAuthenticatedApp() {
  // const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}
