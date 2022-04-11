import { projectHandlers } from './api/projects/project-handlers'
import { authenticationHandlers } from './api/authentication/authentication'
import { vendorDashboardHandlers } from './api/vendor-dashboard/dashboard-handlers'
import { vendorProfileHandlers } from './api/vendor-profile/vendor-profile-handlers'
import { projectDetailHandlers } from './api/projects/project-details-handlers'

export const handlers = [
  ...authenticationHandlers,
  ...projectHandlers,
  ...vendorDashboardHandlers,
  ...vendorProfileHandlers,
  ...projectDetailHandlers,
]
