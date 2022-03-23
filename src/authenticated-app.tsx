import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'

import { Layout } from 'components/layout'
import { Dashboard as VendorDashboard } from 'pages/dashboard'
import { Projects } from 'pages/projects'
import { VendorProfilePage } from 'pages/vendor-profile'
import { ProjectDetails } from 'pages/project-details'
import VendorProfilePassword from 'pages/password'
import { CreateATicket } from 'pages/create-a-ticket'
import { Settings } from 'pages/settings'

export default function AuthenticatedApp() {
  return (
    <Layout>
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
    </Layout>
  )
}
