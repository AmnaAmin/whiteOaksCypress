import { rest, RestRequest } from 'msw'
import {
  ALERT_HISTORIES,
  CHANGE_ORDERS,
  DOCUMENTS,
  DOCUMENT_TYPES,
  getTransactionById,
  makeChangeOrderObject,
  NEW_DOCUMENT,
  WORK_ORDERS,
  WORK_ORDERS_WITH_CHANGE_ORDERS,
} from './data'
import { pushData, getData, appendData } from '../../local-db'
import { PROJECT_FILTER_CARDS, WEEKDAY_FILTER } from './data.pc'

pushData('/documents', DOCUMENTS)
pushData('/transactions', CHANGE_ORDERS)

const projectPCProjectDetailHandlers = [
  rest.get('/api/projectCards', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_FILTER_CARDS))
  }),

  rest.get('/api/projects-due-this-week', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(WEEKDAY_FILTER))
  }),
]

export const projectDetailHandlers = [
  rest.get('/alert/api/alert-histories/project/:projectId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(ALERT_HISTORIES))
  }),

  // Documents Tab APIs
  rest.get('/api/documents', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(getData('/documents')))
  }),
  rest.post('/api/documents', (req: RestRequest, res, ctx) => {
    appendData('/documents', { ...NEW_DOCUMENT, ...(req?.body as Object) })
    return res(ctx.status(201), ctx.json(NEW_DOCUMENT))
  }),

  // Transaction Tab APIs
  rest.get('/api/change-orders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(getData('/transactions')))
  }),
  rest.get('/api/change-orders/:transactionId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(getTransactionById(Number(req.params.transactionId))))
  }),
  rest.put('/api/change-orders', (req, res, ctx) => {
    const newChangeOrder = makeChangeOrderObject(CHANGE_ORDERS[1], req.body)
    CHANGE_ORDERS[1] = newChangeOrder
    pushData('/transactions', CHANGE_ORDERS)
    return res(ctx.status(201), ctx.json(newChangeOrder))
  }),
  rest.post('/api/change-orders', (req, res, ctx) => {
    const newChangeOrder = makeChangeOrderObject(CHANGE_ORDERS[0], req.body)
    appendData('/transactions', newChangeOrder)
    return res(ctx.status(201), ctx.json({}))
  }),
  rest.get('/api/project/:projectId/workordersWithChangeOrders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(WORK_ORDERS_WITH_CHANGE_ORDERS))
  }),
  rest.get('/api/project/:projectId/workorders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(WORK_ORDERS))
  }),

  rest.get('/api/lk_value/lookupType/4', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DOCUMENT_TYPES))
  }),

  ...projectPCProjectDetailHandlers,
]
