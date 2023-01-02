import { rest, RestRequest } from 'msw'
import { CREAT_A_TICKET_MODAL_MOCK } from './creat-a-ticket-modal-mock'
export const creatATicketHandlers = [
  rest.post('/api/supports', (req: RestRequest, res, ctx) => {
    return res(ctx.status(200), ctx.json(CREAT_A_TICKET_MODAL_MOCK))
  }),
]
