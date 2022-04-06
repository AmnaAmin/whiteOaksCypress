import { Layout } from 'components/layout'
import VendorRoutes from 'pages/vendor/routes'
import ProjectCordinatorRoutes from 'pages/project-cordinator/routes'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

export default function AuthenticatedApp() {
  const { isVendor, isProjectCoordinator } = useUserRolesSelector()

  return <Layout>{isVendor ? <VendorRoutes /> : isProjectCoordinator ? <ProjectCordinatorRoutes /> : null}</Layout>
}
