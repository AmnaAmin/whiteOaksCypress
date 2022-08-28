import { Layout } from 'components/layout'
import VendorRoutes from 'pages/vendor/routes'
import ProjectCordinatorRoutes from 'pages/routes'
import VendorManagerRoutes from 'pages/vendor-manager/routes'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export default function AuthenticatedApp() {
  const { isVendor, isProjectCoordinator, isVendorManager } = useUserRolesSelector()
  return (
    <Layout>
      {isVendor ? (
        <VendorRoutes />
      ) : isProjectCoordinator ? (
        <ProjectCordinatorRoutes />
      ) : isVendorManager ? (
        <VendorManagerRoutes />
      ) : null}
    </Layout>
  )
}
