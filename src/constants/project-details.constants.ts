import { ProjectStatus } from 'types/project-details.types'

const OPTIONS = {
  [ProjectStatus.New]: {
    value: ProjectStatus.New,
    label: 'NEW',
  },
  [ProjectStatus.Active]: {
    value: ProjectStatus.Active,
    label: 'ACTIVE',
  },
  [ProjectStatus.Punch]: {
    value: ProjectStatus.Punch,
    label: 'PUNCH',
  },
  [ProjectStatus.Closed]: {
    value: ProjectStatus.Closed,
    label: 'CLOSED',
  },
  [ProjectStatus.Invoiced]: {
    value: ProjectStatus.Invoiced,
    label: 'INVOICED',
  },
  [ProjectStatus.ClientPaid]: {
    value: ProjectStatus.ClientPaid,
    label: 'CLIENT PAID',
  },
  [ProjectStatus.Overpayment]: {
    value: ProjectStatus.Overpayment,
    label: 'OVERPAYMENT',
  },
  [ProjectStatus.Cancelled]: {
    value: ProjectStatus.Cancelled,
    label: 'CANCELLED',
  },
}

export const PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS = {
  [ProjectStatus.New]: [OPTIONS[ProjectStatus.New], OPTIONS[ProjectStatus.Active], OPTIONS[ProjectStatus.Cancelled]],
  [ProjectStatus.Active]: [
    OPTIONS[ProjectStatus.Active],
    OPTIONS[ProjectStatus.Punch],
    OPTIONS[ProjectStatus.Cancelled],
  ],
  [ProjectStatus.Punch]: [
    OPTIONS[ProjectStatus.Punch],
    OPTIONS[ProjectStatus.Active],
    OPTIONS[ProjectStatus.Closed],
    OPTIONS[ProjectStatus.Cancelled],
  ],
  [ProjectStatus.Closed]: [OPTIONS[ProjectStatus.Closed], OPTIONS[ProjectStatus.Invoiced]],
  [ProjectStatus.Invoiced]: [OPTIONS[ProjectStatus.Invoiced], OPTIONS[ProjectStatus.ClientPaid]],
  [ProjectStatus.ClientPaid]: [OPTIONS[ProjectStatus.ClientPaid], OPTIONS[ProjectStatus.Paid]],
  [ProjectStatus.Overpayment]: [OPTIONS[ProjectStatus.Overpayment], OPTIONS[ProjectStatus.Paid]],
  [ProjectStatus.Paid]: [OPTIONS[ProjectStatus.Paid]],
  [ProjectStatus.Cancelled]: [OPTIONS[ProjectStatus.Cancelled]],
}
