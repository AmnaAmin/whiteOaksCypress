import { Route, Routes, Navigate } from 'react-router-dom'

import VendorProfilePassword from 'pages/vendor/password'
import CreateATicket from 'pages/vendor/create-a-ticket'
import Settings from 'pages/vendor/settings'
import { Projects } from 'pages/project-cordinator/projects'
import { ProjectCoordinatorDashboard } from 'pages/project-cordinator/dashboard'
import { ProjectDetails } from 'pages/project-cordinator/project-details'
import { Payable } from './payable'

export default function ProjectCordinatorRoutes() {
  return (
    <Routes>
      <Route path="/logout" element={<div></div>} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/pcDashboard" element={<ProjectCoordinatorDashboard />} />
      <Route path="/project-details/:projectId" element={<ProjectDetails />} />
      <Route path="/payable" element={<Payable />} />
      <Route path="/password" element={<VendorProfilePassword />} />
      <Route path="/support" element={<CreateATicket />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/projects" />} />
    </Routes>
  )
}
