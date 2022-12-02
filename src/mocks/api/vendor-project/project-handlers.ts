import { rest, RestRequest } from 'msw'
import { PROJECT_TABLE_MOCKS } from './project-table-mocks'
export const vendorProejectTableHandlers = [
  rest.get('/api/vendor/workorders', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_TABLE_MOCKS))
  }),
]
