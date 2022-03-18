import { rest } from 'msw'
import { ALERT_HISTORIES, CHANGE_ORDERS, DOCUMENTS, WORK_ORDERS } from './data'

export const projectDetailHandlers = [
  rest.get('/api/change-orders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(CHANGE_ORDERS))
  }),
  rest.get('/api/project/:projectId/workorders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(WORK_ORDERS))
  }),
  rest.get('/api/documents', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DOCUMENTS))
  }),
  rest.get('/alert/api/alert-histories/project/:projectId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(ALERT_HISTORIES))
  }),
]
