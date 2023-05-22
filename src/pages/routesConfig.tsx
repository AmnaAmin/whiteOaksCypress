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
    { path: 'adminDashboard', element: Dashboard, permissions: ['ADMINDASHBOARD.READ', 'ADMINDASHBOARD.EDIT'] },
    {
      path: 'vendorDashboard',
      element: VendorDashboard,
      permissions: ['VENDORDASHBOARD.READ', 'VENDORDASHBOARD.EDIT'],
    },
    { path: 'projects', element: Projects, permissions: ['PROJECTS.READ', 'PROJECTS.EDIT'] },
    { path: 'project-details/:projectId', element: ProjectDetails, permissions: ['PROJECTS.READ', 'PROJECTS.EDIT'] },
    { path: 'estimates', element: Estimates, permissions: ['ESTIMATES.READ', 'ESTIMATES.EDIT'] },
    {
      path: 'estimate-details/:projectId',
      element: EstimateDetails,
      permissions: ['ESTIMATES.READ', 'ESTIMATES.EDIT'],
    },
    { path: 'userManager', element: UserManagement, permissions: ['USERMANAGER.READ', 'USERMANAGER.EDIT'] },
    { path: 'projectType', element: ProjectType, permissions: ['PROJECTTYPE.READ', 'PROJECTTYPE,EDIT'] },
    { path: 'payable', element: Payable, permissions: ['PAYABLE.READ', 'PAYABLE.EDIT'] },
    { path: 'support-tickets', element: SupportTickets, permissions: ['SUPPORT.READ', 'SUPPORT.EDIT'] },
    { path: 'receivable', element: Receivable, permissions: ['RECEIVABLE.READ', 'RECEIVABLE.EDIT'] },
    { path: 'vendors', element: Vendors, permissions: ['VENDORS.READ', 'VENDORS.EDIT'] },
    { path: 'clients', element: Clients, permissions: ['CLIENTS.READ', 'CLIENTS.EDIT'] },
    { path: 'reports', element: Reports, permissions: ['REPORTS.READ'] },
    { path: 'markets', element: Markets, permissions: ['MARKETS.READ', 'MARKETS.EDIT'] },
    { path: 'performance', element: PerformanceTab, permissions: ['PERFORMANCE.READ', 'PERFORMANCE.EDIT'] },
    { path: 'vendorSkills', element: VendorSkills, permissions: ['VENDORSKILLS.READ', 'VENDORSKILLS.EDIT'] },
    { path: 'alerts', element: Alerts, permissions: ['ALERTS.READ', 'ALERTS.EDIT'] },
    { path: 'cypressReport', element: CypressReport, permissions: ['CYPRESSREPORT.READ'] },
    { path: 'projects', element: VendorProjects, permissions: ['VENDORPROJECTS.READ', 'VENDORPROJECTS.EDIT'] },
    {
      path: 'project-details/:projectId',
      element: VendorProjectDetails,
      permissions: ['VENDORPROJECTS.READ', 'VENDORPROJECTS.EDIT'],
    },
    { path: 'vendors', element: VendorProfilePage, permissions: ['VENDORPROFILE.EDIT', 'VENDORPROFILE.READ'] },
  ]
}
