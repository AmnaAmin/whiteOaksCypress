import { Route, Routes, Navigate } from 'react-router-dom'

import VendorProfilePassword from 'pages/vendor/password'
import CreateATicket from 'pages/vendor/create-a-ticket'
import Settings from 'pages/vendor/settings'
import { Projects } from 'pages/projects'
import { ProjectCoordinatorDashboard } from 'pages/dashboard'
import { ProjectDetails } from 'pages/project-details'
import { Payable } from './payable'
import Vendors from './vendor-manager/vendors'
import Clients from './clients'
import Alerts from './alerts'
import { Receivable } from './receivable'

export default function ProjectCordinatorRoutes() {
  return (
    <Routes>
      <Route path="/logout" element={<div></div>} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/pcDashboard" element={<ProjectCoordinatorDashboard />} />
      <Route path="/project-details/:projectId" element={<ProjectDetails />} />
      <Route path="/payable" element={<Payable />} />
      <Route path="/receivable" element={<Receivable />} />
      <Route path="vendors" element={<Vendors />} />
      <Route path="alerts" element={<Alerts />} />
      <Route path="clients" element={<Clients />} />
      <Route path="/password" element={<VendorProfilePassword />} />
      <Route path="/support" element={<CreateATicket />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/projects" />} />
    </Routes>
  )
}
