import { rest } from 'msw'
import { VENDOR_DATA, WO_BY_VENDORS_PER_MONTH } from './data'

export const vendorDashboardHandlers = [
  rest.get('/api/vendors/:vendorId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(VENDOR_DATA))
  }),
  rest.get('/api/getWoByVendorsPerMonth/:vendorId', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(WO_BY_VENDORS_PER_MONTH))
  }),
  rest.get('/api/project/getPaidWOAmountByYearAndMonth/:year/:month', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
  }),
  rest.get('/api/project/getPaidWOAmountByYearAndMonthTotal/:year/:month', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(6380))
  }),
]
