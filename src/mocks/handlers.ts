import { projectHandlers } from './api/projects/project-handlers'
import { authenticationHandlers } from './api/authentication/authentication'
import { vendorDashboardHandlers } from './api/vendor-dashboard/dashboard-handlers'
import { vendorProfileHandlers } from './api/vendor-profile/vendor-profile-handlers'
import { projectDetailHandlers } from './api/projects/project-details-handlers'
import { workOrderHandlers } from './api/workorder/work-order-handlers'
import { projectTypeHandlers } from './api/project-type/project-type-handlers'
import { creatATicketHandlers } from './api/creat-a-ticket/creat-a-ticket-handlers'
import { vendorProejectTableHandlers } from './api/vendor-project/project-handlers'
import { projectFilterTilesHandlers } from './api/vendor-project/project-filter-tiles-handlere'
import { upcomingPaymentTableHandlers } from './api/dashboard/upcoming-payment-handlere'
import { alertHandlers } from './api/alerts/alerts-handlers'

export const handlers = [
  ...authenticationHandlers,
  ...projectHandlers,
  ...vendorDashboardHandlers,
  ...vendorProfileHandlers,
  ...projectDetailHandlers,
  ...workOrderHandlers,
  ...projectTypeHandlers,
  ...creatATicketHandlers,
  ...vendorProejectTableHandlers,
  ...projectFilterTilesHandlers,
  ...upcomingPaymentTableHandlers,
  ...alertHandlers,
]
