import { projectHandlers } from "./api/projects/project-handlers";
import { authenticationHandlers } from "./api/authentication/authentication";
import { vendorDashboardHanlders } from "./api/vendor-dashboard/dashboard-handlers";

export const handlers = [
  ...authenticationHandlers,
  ...projectHandlers,
  ...vendorDashboardHanlders,
];
