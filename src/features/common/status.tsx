import React from 'react'
import { Tag, TagLabel } from '@chakra-ui/react'

export const STATUS_CODE = {
  DECLINED: 111,
  INVOICED: 110,
}

export enum PERFORM {
  SelfPer = 'Self-Perform 20',
  CoPer20 = 'CO-Perform 20',
  COPer14 = 'CO-Perform 14',
  CoPer7 = 'CO-Perform 7',
  NewPlan1='$0 - $10,000',
  NewPlan2='$10,001 - $25,000',
  NewPlan3='$25,001 - $50,000',
  NewPlan4='> $50,000',
}

export enum STATUS {
  Paid = 'paid',
  Active = 'active',
  Approved = 'approved',
  Completed = 'completed',
  PastDue = 'past due',
  Pending = 'pending',
  Denied = 'denied',
  Cancelled = 'cancelled',
  Invoiced = 'invoiced',
  Punch = 'punch',
  New = 'new',
  Closed = 'closed',
  ClientPaid = 'client paid',
  Overpayment = 'overpayment',
  Collection = 'collection',
  Disputed = 'disputed',
  Cancel = 'cancel',
  Expired = 'expired',
  Declined = 'declined',
  Inactive = 'inactive',
  DoNotUse = 'do not use',
  Decline = 'decline',
  Reconcile = 'reconcile',
  Rejected = 'rejected',
  Pending_payment = 'pending_payment',
  Partial_paid = 'partial paid'
}

const STATUS_COLOR = {
  [STATUS.Paid]: { color: '#D69E2E', backgroundColor: '#FFFBF4' },
  [STATUS.Active]: { color: '#4299E1', backgroundColor: '#F3F9FC' },
  [STATUS.Approved]: { color: '#4E87F8', backgroundColor: '#EBF8FF' },
  [STATUS.Completed]: { color: '#ED8936 ', backgroundColor: '#FFF5E4' },
  [STATUS.PastDue]: { color: '#DD6B20', backgroundColor: '#FFFAF5' },
  [STATUS.Pending]: { color: '#B7791F', backgroundColor: '#FEFCBF' },
  [STATUS.Denied]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Declined]: { color: '#9F7AEA', backgroundColor: '#FAF5FF' },
  [STATUS.Cancelled]: { color: '#E53E3E', backgroundColor: '#FFFFFF' },
  [STATUS.Invoiced]: { color: '#319795', backgroundColor: '#FFF7EA' },
  [STATUS.Punch]: { color: '#ED64A6', backgroundColor: '#FFF7F6' },
  [STATUS.New]: { color: '#ED8936', backgroundColor: '#FFF7EA' },
  [STATUS.Closed]: { color: '#B794F4', backgroundColor: '#F6F9FF' },
  [STATUS.ClientPaid]: { color: '#48BB78', backgroundColor: '#F9FEFA' },
  [STATUS.Overpayment]: { color: '#38B2AC', backgroundColor: '#F5FFFF' },
  [STATUS.Collection]: { color: '#9F7AEA', backgroundColor: '#FAF5FF' },
  [STATUS.Disputed]: { color: '#ED64A6', backgroundColor: '#FFFBFC' },
  [STATUS.Cancel]: { color: '#E53E3E', backgroundColor: '#FFF5F7' },
  [STATUS.Expired]: { color: '#F56565', backgroundColor: '#FFF5F5' },
  [STATUS.Inactive]: { color: '#ED64A6', backgroundColor: '#FFF5F7' },
  [STATUS.DoNotUse]: { color: '#F56565', backgroundColor: '#FEFEFE' },
  [STATUS.Decline]: { color: '#9F7AEA', backgroundColor: '#FAF5FF' },
  [STATUS.Rejected]: { color: '#9F7AEA', backgroundColor: '#FAF5FF' },
  [STATUS.Reconcile]: { color: '#4A5568', backgroundColor: '#F8F6CD' },
  [STATUS.Pending_payment]: { color: '#0BC5EA', backgroundColor: '#C4F1F9' },
  [STATUS.Partial_paid]: { color: '#D69E2E', backgroundColor: '#FFFBF4' }
}

const Status = ({ value = '', id = '' }: { value?: string; id?: string }) => {
  const style = STATUS_COLOR[id?.toLocaleLowerCase()]

  return (
    <Tag
      data-testid="status"
      size="md"
      rounded="4px"
      variant="solid"
      backgroundColor={style?.backgroundColor}
      color={style?.color}
      borderWidth="0.5px"
      borderStyle="solid"
      borderColor={style?.color}
    >
      <TagLabel fontSize="14px" fontStyle="normal" fontWeight={400} p="2px 10px 2px 10px" textTransform="capitalize">
        {value?.toLocaleLowerCase()}
      </TagLabel>
    </Tag>
  )
}

export default Status

export const PROJECT_STATUS = {
  new: { value: '7', label: 'NEW' },
  active: { value: '8', label: 'ACTIVE' },
  punch: { value: '9', label: 'PUNCH' },
  invoiced: { value: '11', label: 'INVOICED' },
  paid: { value: '41', label: 'PAID' },
  closed: { value: '10', label: 'CLOSED' },
  cancelled: { value: '33', label: 'CANCELLED' },
  clientPaid: { value: '72', label: 'CLIENT PAID' },
  overpayment: { value: '109', label: 'Overpayment' },
  disputed: { value: '220', label: 'DISPUTED' },
  reconcile: { value: '120', label: 'RECONCILE' },
}
