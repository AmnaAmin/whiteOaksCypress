import { rest } from 'msw'
import { LINEITEMS } from './data'

export const workOrderHandlers = [
  rest.get('/smartwo/api/line-items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(LINEITEMS))
  }),
]
