import { Route, Routes, Navigate } from 'react-router-dom'

import VendorProfilePassword from 'pages/vendor/password'
import CreateATicket from 'pages/vendor/create-a-ticket'
import Settings from 'pages/vendor/settings'
import Vendors from '../project-cordinator/vendors'
import { VendorSkills } from 'pages/vendor-skills'

export default function VendorManagerRoutes() {
  return (
    <Routes>
      <Route path="/logout" element={<div></div>} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/password" element={<VendorProfilePassword />} />
      <Route path="/support" element={<CreateATicket />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/vendors" />} />
      <Route path="/vendorSkills" element={<VendorSkills />} />
    </Routes>
  )
}
