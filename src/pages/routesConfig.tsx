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
// import { Performance } from './fpm/performance' fpm performance is hidden
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
  return [
    { path: 'adminDashboard', element: Dashboard, permission: 'MENU.ADMINDASHBOARD' },
    { path: 'vendorDashboard', element: VendorDashboard, permission: 'MENU.VENDORDASHBOARD' },
    { path: 'projects', element: Projects, permission: 'MENU.PROJECTS' },
    { path: 'project-details/:projectId', element: ProjectDetails, permission: 'MENU.PROJECTS' },
    { path: 'estimates', element: Estimates, permission: 'MENU.ESTIMATES' },
    { path: 'estimate-details/:projectId', element: EstimateDetails, permission: 'MENU.ESTIMATES' },
    { path: 'userManager', element: UserManagement, permission: 'MENU.USERMANAGER' },
    { path: 'projectType', element: ProjectType, permission: 'MENU.PROJECTTYPE' },
    { path: 'payable', element: Payable, permission: 'MENU.PAYABLE' },
    { path: 'support-tickets', element: SupportTickets, permission: 'MENU.SUPPORT' },
    { path: 'receivable', element: Receivable, permission: 'MENU.RECEIVABLE' },
    { path: 'vendors', element: Vendors, permission: 'MENU.VENDORS' },
    { path: 'clients', element: Clients, permission: 'MENU.CLIENTS' },
    { path: 'reports', element: Reports, permission: 'MENU.REPORTS' },
    { path: 'markets', element: Markets, permission: 'MENU.MARKETS' },
    { path: 'performance', element: PerformanceTab, permission: 'MENU.PERFORMANCE' },
    { path: 'vendorSkills', element: VendorSkills, permission: 'MENU.VENDORSKILLS' },
    { path: 'alerts', element: Alerts, permission: 'MENU.ALERTS' },
    { path: 'cypressReport', element: CypressReport, permission: 'MENU.CYPRESSREPORT' },
    { path: 'projects', element: VendorProjects, permission: 'MENU.VENDORPROJECTS' },
    { path: 'project-details/:projectId', element: VendorProjectDetails, permission: 'MENU.PROJECTS' },
    { path: 'vendors', element: VendorProfilePage, permission: 'MENU.PROJECTS' },
  ]
}
