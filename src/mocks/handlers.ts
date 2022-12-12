import { projectHandlers } from './api/projects/project-handlers'
import { authenticationHandlers } from './api/authentication/authentication'
import { vendorDashboardHandlers } from './api/vendor-dashboard/dashboard-handlers'
import { vendorProfileHandlers } from './api/vendor-profile/vendor-profile-handlers'
import { projectDetailHandlers } from './api/projects/project-details-handlers'
import { workOrderHandlers } from './api/workorder/work-order-handlers'
import { projectTypeHandlers } from './api/project-type/project-type-handlers'
import { creatATicketHandlers } from './api/creat-a-ticket/creat-a-ticket-handlers'

export const handlers = [
  ...authenticationHandlers,
  ...projectHandlers,
  ...vendorDashboardHandlers,
  ...vendorProfileHandlers,
  ...projectDetailHandlers,
  ...workOrderHandlers,
  ...projectTypeHandlers,
  ...creatATicketHandlers,
]
