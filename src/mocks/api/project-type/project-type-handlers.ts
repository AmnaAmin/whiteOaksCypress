import { rest, RestRequest } from 'msw'
import { PROJECT_TYPE_MOCK } from './project-type-mocks'
export const projectTypeHandlers = [
  rest.get('/api/project_type', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_TYPE_MOCK))
  }),

  rest.post('/api/project_type', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_TYPE_MOCK))
  }),

  rest.put('/api/project_type', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_TYPE_MOCK))
  }),
]
