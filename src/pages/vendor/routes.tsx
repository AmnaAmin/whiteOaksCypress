import { Route, Routes, Navigate } from 'react-router-dom'

import { Dashboard as VendorDashboard } from 'pages/vendor/dashboard'
import { Projects } from 'pages/vendor/projects'
import { VendorProfilePage } from 'pages/vendor/vendor-profile'
import { ProjectDetails } from 'pages/vendor/project-details'
import VendorProfilePassword from 'pages/vendor/password'
import { CreateATicket } from 'pages/vendor/create-a-ticket'
import { Settings } from 'pages/vendor/settings'

export default function VendorRoutes() {
  return (
    <Routes>
      <Route path="/vendorDashboard" element={<VendorDashboard />} />
      <Route path="/logout" element={<div></div>} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/project-details/:projectId" element={<ProjectDetails />} />
      <Route path="/vendors" element={<VendorProfilePage />} />
      <Route path="/password" element={<VendorProfilePassword />} />
      <Route path="/support" element={<CreateATicket />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/vendorDashboard" />} />
    </Routes>
  )
}
