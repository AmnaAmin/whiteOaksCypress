import { rest } from 'msw'
import { PAYMENT_OPTIONS, VENDOR_SKILLS, MARKETS } from './data'

export const vendorProfileHandlers = [
  rest.get('/api/lk_value/payment/options', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(PAYMENT_OPTIONS))
  }),

  rest.get('api/vendor-skills', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(VENDOR_SKILLS))
  }),
  rest.get('/api/markets', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(MARKETS))
  }),
]
