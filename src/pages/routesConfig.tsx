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
import Alerts from './alerts'
// import { ProjectCoordinatorDashboard } from 'pages/dashboard'

import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { Performance } from './fpm/performance'
import { PerformanceTab } from 'features/performance/performance'
import { UserManagement } from './admin/user-management'
import Dashboard from './admin/dashboard'
import { ProjectType } from './admin/project-type'
import { SupportTickets } from './admin/support-tickets'

import { Estimates } from 'pages/estimates'
import { EstimateDetails } from 'pages/estimate-details'
import CypressReport from './cypress-report'

const VendorDashboard = lazy(() => import('pages/vendor/dashboard'))
const VendorProjects = lazy(() => import('pages/vendor/projects'))
const VendorProfilePage = lazy(() => import('pages/vendor/vendor-profile-v-portal'))
const VendorProjectDetails = lazy(() => import('pages/vendor/project-details'))

export default function useRoutesConfig() {
  const {
    isFPM,
    isProjectCoordinator,
    isVendor,
    isVendorManager,
    isDoc,
    isAdmin,
    isAccounting,
    isOperations,
    isClientManager,
    isConstructionOperations,
  } = useUserRolesSelector()
  switch (true) {
    case isFPM:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'vendors', element: Vendors },
        { path: 'performance', element: Performance },
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
        { path: 'performance', element: PerformanceTab },
        { path: 'clients', element: Clients },
      ]

    case isVendor:
      return [
        { path: 'vendorDashboard', element: VendorDashboard },
        { path: 'projects', element: VendorProjects },
        { path: 'project-details/:projectId', element: VendorProjectDetails },
        { path: 'vendors', element: VendorProfilePage },
      ]
    case isAdmin:
      return [
        { path: 'adminDashboard', element: Dashboard },
        { path: 'userManager', element: UserManagement },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'projectType', element: ProjectType },
        { path: 'estimates', element: Estimates },
        { path: 'projects', element: Projects },
        { path: 'payable', element: Payable },
        { path: 'support-tickets', element: SupportTickets },
        { path: 'receivable', element: Receivable },
        { path: 'vendors', element: Vendors },
        { path: 'clients', element: Clients },
        { path: 'reports', element: Reports },
        { path: 'markets', element: Markets },
        { path: 'performance', element: PerformanceTab },
        { path: 'vendorSkills', element: VendorSkills },
        { path: 'alerts', element: Alerts },
        { path: 'estimate-details/:projectId', element: EstimateDetails },
        { path: 'cypressReport', element: CypressReport },
      ]

    case isAccounting:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'payable', element: Payable },
        { path: 'receivable', element: Receivable },
        { path: 'vendors', element: Vendors },
        { path: 'clients', element: Clients },
        { path: 'reports', element: Reports },
        { path: 'performance', element: PerformanceTab },
      ]
    case isOperations:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'payable', element: Payable },
        { path: 'receivable', element: Receivable },
        { path: 'vendors', element: Vendors },
        { path: 'clients', element: Clients },
        { path: 'reports', element: Reports },
        { path: 'performance', element: PerformanceTab },
      ]
    case isClientManager:
      return [{ path: 'clients', element: Clients }]

    case isConstructionOperations:
      return [
        { path: 'projects', element: Projects },
        { path: 'project-details/:projectId', element: ProjectDetails },
        { path: 'vendors', element: Vendors },
      ]

    default:
      return []
  }
}
