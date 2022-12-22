import { rest } from 'msw'
import { LINEITEMS, assignedItems } from './data'

export const workOrderHandlers = [
  rest.get('/smartwo/api/line-items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(LINEITEMS))
  }),
  rest.get('/api/work-orders/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(assignedItems))
  }),
]
