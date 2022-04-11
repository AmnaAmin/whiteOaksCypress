import { rest } from 'msw'
import { PROJECTS, VENDOR_CARDS, PROJECT_VENDOR, SETTING_COLUMNS } from './data'

export const projectHandlers = [
  rest.get('/api/projects/:projectId/vendor', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_VENDOR))
  }),
  rest.get('/api/projects', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECTS))
  }),
  rest.get('/api/vendorCards', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(VENDOR_CARDS))
  }),
  rest.get('/api/column/project', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(SETTING_COLUMNS))
  }),
]
