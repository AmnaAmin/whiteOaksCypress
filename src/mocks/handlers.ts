import { projectHandlers } from './api/projects/project-handlers'
import { authenticationHandlers } from './api/authentication/authentication'
import { vendorDashboardHanlders } from './api/vendor-dashboard/dashboard-handlers'
import { projectDetailHandlers } from './api/projects/project-details-handlers'

export const handlers = [
  ...authenticationHandlers,
  ...projectHandlers,
  ...vendorDashboardHanlders,
  ...projectDetailHandlers,
]
