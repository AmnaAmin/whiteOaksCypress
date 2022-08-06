import { STATUS } from 'features/projects/status'

export const PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS = {
  [STATUS.New]: [STATUS.New, STATUS.Active, STATUS.Cancelled],
  [STATUS.Active]: [STATUS.Active, STATUS.Punch, STATUS.Cancelled],
  [STATUS.Punch]: [STATUS.Punch, STATUS.Active, STATUS.Closed, STATUS.Cancelled],
  [STATUS.Closed]: [STATUS.Closed, STATUS.Invoiced],
  [STATUS.Invoiced]: [STATUS.Invoiced, STATUS.ClientPaid],
  [STATUS.ClientPaid]: [STATUS.ClientPaid, STATUS.Paid],
  [STATUS.Overpayment]: [STATUS.Overpayment, STATUS.Paid],
  [STATUS.Paid]: [STATUS.Paid],
  [STATUS.Cancelled]: [STATUS.Cancelled],
}
