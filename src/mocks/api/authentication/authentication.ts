import { rest } from 'msw'
import { getUserData, makeToken } from './data'

export const authenticationHandlers = [
  rest.post('/api/authenticate', (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({ id_token: makeToken(20) }),
    )
  }),

  rest.get('/api/account', (req, res, ctx) => {
    const token = req.headers.get('authorization')

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(getUserData(token || 'vendor')),
    )
  }),
]
