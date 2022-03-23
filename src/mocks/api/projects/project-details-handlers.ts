import { rest, RestRequest } from 'msw'
import { ALERT_HISTORIES, CHANGE_ORDERS, DOCUMENTS, NEW_DOCUMENT, WORK_ORDERS } from './data'
import { pushData, getData, appendData } from '../../local-db'

pushData('/documents', DOCUMENTS)

export const projectDetailHandlers = [
  rest.get('/api/change-orders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(CHANGE_ORDERS))
  }),
  rest.get('/api/project/:projectId/workorders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(WORK_ORDERS))
  }),
  rest.get('/api/documents', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(getData('/documents')))
  }),
  rest.get('/alert/api/alert-histories/project/:projectId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(ALERT_HISTORIES))
  }),
  rest.post('/api/documents', (req: RestRequest, res, ctx) => {
    console.log(req.body)
    appendData('/documents', { ...NEW_DOCUMENT, ...(req?.body as Object) })
    return res(ctx.status(201), ctx.json(NEW_DOCUMENT))
  }),
]
