import { rest, RestRequest } from 'msw'
import { UPCOMING_PAYMENT_TABLE_MOCK } from './upcoming-payment-table-mock'
export const upcomingPaymentTableHandlers = [
  rest.get('/api/all-payables', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(UPCOMING_PAYMENT_TABLE_MOCK))
  }),
]
