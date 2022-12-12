import { Route, Routes, Navigate } from 'react-router-dom'

import VendorProfilePassword from 'pages/vendor/password'
import Settings from 'pages/vendor/settings'
import routesConfig from './routesConfig'
import { Suspense } from 'react'
import { ViewLoader } from 'components/page-level-loader'
import first from 'lodash/first'
import { CreateATicketForm } from './vendor/create-a-ticket'

export default function ProjectCordinatorRoutes() {
  const routes = routesConfig()
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
            <Suspense fallback={ViewLoader}>
              <page.element />
            </Suspense>
          }
        />
      ))}
      <Route path="*" element={<Navigate to={route?.path || '/settings'} />} />
    </Routes>
  )
}
