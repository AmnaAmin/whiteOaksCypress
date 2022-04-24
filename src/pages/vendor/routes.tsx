import { ViewLoader } from 'components/page-level-loader'
import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

const VendorDashboard = lazy(() => import('pages/vendor/dashboard'))
const Projects = lazy(() => import('pages/vendor/projects'))
const VendorProfilePage = lazy(() => import('pages/vendor/vendor-profile'))
const ProjectDetails = lazy(() => import('pages/vendor/project-details'))
const VendorProfilePassword = lazy(() => import('pages/vendor/password'))
const CreateATicket = lazy(() => import('pages/vendor/create-a-ticket'))
const Settings = lazy(() => import('pages/vendor/settings'))

export default function VendorRoutes() {
  return (
    <Routes>
      <Route
        path="/vendorDashboard"
        element={
          <Suspense fallback={<ViewLoader />}>
            <VendorDashboard />
          </Suspense>
        }
      />
      <Route
        path="/logout"
        element={
          <Suspense fallback={<ViewLoader />}>
            <div></div>
          </Suspense>
        }
      />
      <Route
        path="/projects"
        element={
          <Suspense fallback={<ViewLoader />}>
            <Projects />
          </Suspense>
        }
      />
      <Route
        path="/project-details/:projectId"
        element={
          <Suspense fallback={<ViewLoader />}>
            <ProjectDetails />
          </Suspense>
        }
      />
      <Route
        path="/vendors"
        element={
          <Suspense fallback={<ViewLoader />}>
            <VendorProfilePage />
          </Suspense>
        }
      />
      <Route
        path="/password"
        element={
          <Suspense fallback={<ViewLoader />}>
            <VendorProfilePassword />
          </Suspense>
        }
      />
      <Route
        path="/support"
        element={
          <Suspense fallback={<ViewLoader />}>
            <CreateATicket />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<ViewLoader />}>
            <Settings />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/vendorDashboard" />} />
    </Routes>
  )
}
