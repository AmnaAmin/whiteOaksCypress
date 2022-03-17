import { rest } from 'msw'
import { ALERT_HISTORIES, CHANGE_ORDERS, DOCUMENTS, PROJECTS, VENDOR_CARDS, WORK_ORDERS } from './data'

export const projectHandlers = [
  rest.get('/api/projects', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECTS))
  }),
  rest.get('/api/vendorCards', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(VENDOR_CARDS))
  }),
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
  rest.get('/api/project/column/project', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
]
