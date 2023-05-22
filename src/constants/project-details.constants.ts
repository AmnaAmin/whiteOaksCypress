import { ProjectStatus } from 'types/project-details.types'

const OPTIONS = {
  [ProjectStatus.New]: {
    value: ProjectStatus.New,
    label: 'New',
  },
  [ProjectStatus.Active]: {
    value: ProjectStatus.Active,
    label: 'Active',
  },
  [ProjectStatus.Punch]: {
    value: ProjectStatus.Punch,
    label: 'Punch',
  },
  [ProjectStatus.Reconcile]: {
    value: ProjectStatus.Reconcile,
    label: 'Reconcile',
  },
  [ProjectStatus.Closed]: {
    value: ProjectStatus.Closed,
    label: 'Closed',
  },
  [ProjectStatus.Invoiced]: {
    value: ProjectStatus.Invoiced,
    label: 'Invoiced',
  },
  [ProjectStatus.ClientPaid]: {
    value: ProjectStatus.ClientPaid,
    label: 'Client Paid',
  },
  [ProjectStatus.Overpayment]: {
    value: ProjectStatus.Overpayment,
    label: 'OverPayment',
  },
  [ProjectStatus.Cancelled]: {
    value: ProjectStatus.Cancelled,
    label: 'Cancelled',
  },
  [ProjectStatus.Paid]: {
    value: ProjectStatus.Paid,
    label: 'Paid',
  },
  [ProjectStatus.Disputed]: {
    value: ProjectStatus.Disputed,
    label: 'Disputed',
  },
}

export const PROJECT_STATUSES_ASSOCIATE_WITH_CURRENT_STATUS = {
  [ProjectStatus.New]: [OPTIONS[ProjectStatus.New], OPTIONS[ProjectStatus.Active], OPTIONS[ProjectStatus.Cancelled]],
  [ProjectStatus.Active]: [
    OPTIONS[ProjectStatus.Active],
    OPTIONS[ProjectStatus.Punch],
    OPTIONS[ProjectStatus.Cancelled],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.Punch]: [
    OPTIONS[ProjectStatus.Active],
    OPTIONS[ProjectStatus.Punch],
    OPTIONS[ProjectStatus.Reconcile],
    OPTIONS[ProjectStatus.Closed],
    OPTIONS[ProjectStatus.Cancelled],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.Reconcile]: [
    OPTIONS[ProjectStatus.Active],
    OPTIONS[ProjectStatus.Punch],
    OPTIONS[ProjectStatus.Closed],
    OPTIONS[ProjectStatus.Cancelled],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.Closed]: [
    OPTIONS[ProjectStatus.Closed],
    OPTIONS[ProjectStatus.Invoiced],
    OPTIONS[ProjectStatus.Reconcile],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.Invoiced]: [
    OPTIONS[ProjectStatus.Invoiced],
    OPTIONS[ProjectStatus.ClientPaid],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.ClientPaid]: [
    OPTIONS[ProjectStatus.ClientPaid],
    OPTIONS[ProjectStatus.Paid],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.Overpayment]: [
    OPTIONS[ProjectStatus.Overpayment],
    OPTIONS[ProjectStatus.Paid],
    OPTIONS[ProjectStatus.Disputed],
  ],
  [ProjectStatus.Paid]: [OPTIONS[ProjectStatus.Paid], OPTIONS[ProjectStatus.Disputed]],
  [ProjectStatus.Cancelled]: [OPTIONS[ProjectStatus.Cancelled]],
  [ProjectStatus.Disputed]: [OPTIONS[ProjectStatus.Disputed]],
}
