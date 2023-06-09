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
import { AccessControl } from './access-control'

const VendorDashboard = lazy(() => import('pages/vendor/dashboard'))
const VendorProjects = lazy(() => import('pages/vendor/projects'))
const VendorProfilePage = lazy(() => import('pages/vendor/vendor-profile-v-portal'))
const VendorProjectDetails = lazy(() => import('pages/vendor/project-details'))

export default function useRoutesConfig() {
  return [
    { path: 'adminDashboard', element: Dashboard, permissions: ['ADMINDASHBOARD.READ', 'ADMINDASHBOARD.EDIT', 'ALL'] },
    {
      path: 'vendorDashboard',
      element: VendorDashboard,
      permissions: ['VENDORDASHBOARD.READ', 'VENDORDASHBOARD.EDIT'],
    },
    { path: 'projects', element: Projects, permissions: ['PROJECT.READ', 'PROJECT.EDIT', 'ALL'] },
    {
      path: 'project-details/:projectId',
      element: ProjectDetails,
      permissions: ['PROJECT.READ', 'PROJECT.EDIT', 'ALL'],
    },
    { path: 'estimates', element: Estimates, permissions: ['ESTIMATE.READ', 'ESTIMATE.EDIT', 'ALL'] },
    {
      path: 'estimate-details/:projectId',
      element: EstimateDetails,
      permissions: ['ESTIMATE.READ', 'ESTIMATE.EDIT', 'ALL'],
    },
    { path: 'userManager', element: UserManagement, permissions: ['USERMANAGER.READ', 'USERMANAGER.EDIT', 'ALL'] },
    { path: 'roles', element: AccessControl, permissions: ['ALL'] },
    { path: 'projectType', element: ProjectType, permissions: ['PROJECTTYPE.READ', 'PROJECTTYPE,EDIT', 'ALL'] },
    { path: 'payable', element: Payable, permissions: ['PAYABLE.READ', 'PAYABLE.EDIT', 'ALL'] },
    { path: 'support-tickets', element: SupportTickets, permissions: ['SUPPORT.READ', 'SUPPORT.EDIT', 'ALL'] },
    { path: 'receivable', element: Receivable, permissions: ['RECEIVABLE.READ', 'RECEIVABLE.EDIT', 'ALL'] },
    { path: 'vendors', element: Vendors, permissions: ['VENDOR.READ', 'VENDOR.EDIT', 'ALL'] },
    { path: 'clients', element: Clients, permissions: ['CLIENT.READ', 'CLIENT.EDIT', 'ALL'] },
    { path: 'reports', element: Reports, permissions: ['REPORT.READ', 'ALL'] },
    { path: 'markets', element: Markets, permissions: ['MARKET.READ', 'MARKET.EDIT', 'ALL'] },
    { path: 'performance', element: PerformanceTab, permissions: ['PERFORMANCE.READ', 'PERFORMANCE.EDIT', 'ALL'] },
    { path: 'vendorSkills', element: VendorSkills, permissions: ['VENDORSKILL.READ', 'VENDORSKILL.EDIT', 'ALL'] },
    { path: 'alerts', element: Alerts, permissions: ['ALERT.READ', 'ALERT.EDIT', 'ALL'] },
    { path: 'cypressReport', element: CypressReport, permissions: ['CYPRESSREPORT.READ', 'ALL'] },
    { path: 'projects', element: VendorProjects, permissions: ['VENDORPROJECT.READ', 'VENDORPROJECT.EDIT'] },
    {
      path: 'project-details/:projectId',
      element: VendorProjectDetails,
      permissions: ['VENDORPROJECT.READ', 'VENDORPROJECT.EDIT'],
    },
    { path: 'vendors', element: VendorProfilePage, permissions: ['VENDORPROFILE.EDIT', 'VENDORPROFILE.READ'] },
  ]
}
