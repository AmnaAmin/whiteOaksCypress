import { lazy } from 'react'
import { Projects } from 'pages/projects'
import { ProjectDetails } from 'pages/project-details'
import { Payable } from './payable'
import Vendors from './vendor-manager/vendors'
import Reports from './reports'
import Clients from './clients'
import { Receivable } from './receivable'
import { VendorSkills } from 'pages/vendor-manager/vendor-skills'
import { Markets } from 'pages/vendor-manager/markets'
// import Alerts from './alerts'
// import { ProjectCoordinatorDashboard } from 'pages/dashboard'

import { useUserRolesSelector } from 'utils/redux-common-selectors'

const VendorDashboard = lazy(() => import('pages/vendor/dashboard'))
const VendorProjects = lazy(() => import('pages/vendor/projects'))
const VendorProfilePage = lazy(() => import('pages/vendor/vendor-profile'))
const VendorProjectDetails = lazy(() => import('pages/vendor/project-details'))

export default function useRoutesConfig() {
  const { isFPM, isProjectCoordinator, isVendor, isVendorManager, isDoc } = useUserRolesSelector()
  switch (true) {
    case isFPM:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
      ]
    case isProjectCoordinator:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'payable', element: Payable },
        { path: 'receivable', element: Receivable },
        { path: 'vendors', element: Vendors },
        { path: 'clients', element: Clients },
        // { path: 'alerts', element: Alerts },
        // { path: 'pcDashboard', element: ProjectCoordinatorDashboard },
      ]

    case isVendorManager:
      return [
        { path: 'vendors', element: Vendors },
        { path: 'vendorSkills', element: VendorSkills },
        { path: 'markets', element: Markets },
      ]

    case isDoc:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'vendors', element: Vendors },
        { path: 'reports', element: Reports },
      ]

    case isVendor:
      return [
        { path: 'vendorDashboard', element: VendorDashboard },
        { path: 'projects', element: VendorProjects },
        { path: 'project-details/:projectId', element: VendorProjectDetails },
        { path: 'vendors', element: VendorProfilePage },
      ]

    default:
      return []
  }
}
