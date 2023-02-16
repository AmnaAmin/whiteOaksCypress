import { rest, RestRequest } from 'msw'
import { TRIGGEREDALERTS } from './alerts'
export const alertHandlers = [
  rest.get('/alert/api/alert-histories', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(TRIGGEREDALERTS))
  }),
]
