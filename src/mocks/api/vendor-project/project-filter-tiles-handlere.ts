import { PROJECT_FILTER_CARDS } from 'features/vendor/projects/project-filter-mock'
import { rest, RestRequest } from 'msw'
export const projectFilterTilesHandlers = [
  rest.get('/api/vendor-wo-Cards', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(PROJECT_FILTER_CARDS))
  }),
]
