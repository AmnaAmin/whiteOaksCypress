import { Route, Routes, Navigate } from 'react-router-dom'

import VendorProfilePassword from 'pages/vendor/password'
import Settings from 'pages/vendor/settings'
import routesConfig from './routesConfig'
import { Suspense } from 'react'
import { ViewLoader } from 'components/page-level-loader'
import first from 'lodash/first'
import { CreateATicketForm } from './vendor/create-a-ticket-form'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export default function ProjectCordinatorRoutes() {
  const { permissions, isAdmin } = useRoleBasedPermissions()
  const routes = isAdmin
    ? routesConfig()
    : routesConfig()?.filter(r => permissions.some(p => r.permissions.includes(p)))
  const route = first(routes)
  return (
    <Routes>
      <Route path="/logout" element={<div></div>} />
      <Route path="/password" element={<VendorProfilePassword />} />
      <Route path="/support" element={<CreateATicketForm />} />
      <Route path="/settings" element={<Settings />} />
      {routes.map(page => (
        <Route
          key={page.path}
          path={`/${page.path}`}
          element={
            <Suspense fallback={<ViewLoader />}>
              <page.element />
            </Suspense>
          }
        />
      ))}
      <Route path="*" element={<Navigate to={route?.path || '/settings'} />} />
    </Routes>
  )
}
