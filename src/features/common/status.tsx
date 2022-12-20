import React from 'react'
import { Tag, TagLabel } from '@chakra-ui/react'

export const STATUS_CODE = {
  DECLINED: 111,
  INVOICED: 110,
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
  Dispute = 'dispute',
  Cancel = 'cancel',
  Expired = 'expired',
  Declined = 'declined',
  Inactive = 'inactive',
  DoNotUse = 'do not use',
  Decline = 'decline',
}

const STATUS_COLOR = {
  [STATUS.Paid]: { color: '#C05621', backgroundColor: '#FEEBCB ' },
  [STATUS.Active]: { color: '#4299E1', backgroundColor: '#EBF8FF' },
  [STATUS.Approved]: { color: '#4E87F8', backgroundColor: '#EBF8FF' },
  [STATUS.Completed]: { color: '#ED8936 ', backgroundColor: '#FEEBCB' },
  [STATUS.PastDue]: { color: '#ED8936', backgroundColor: '#FCE8D8' },
  [STATUS.Pending]: { color: '#B7791F', backgroundColor: '#FEFCBF' },
  [STATUS.Denied]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Declined]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Cancelled]: { color: '#F56565', backgroundColor: '#FFF5F7' },
  [STATUS.Invoiced]: { color: '#48BB78', backgroundColor: '#E2EFDF' },
  [STATUS.Punch]: { color: '#F687B3', backgroundColor: '#FAE6E5' },
  [STATUS.New]: { color: '#ED8936', backgroundColor: '#FEEBCB' },
  [STATUS.Closed]: { color: '#B794F4', backgroundColor: '#E5ECF9' },
  [STATUS.ClientPaid]: { color: '#48BB78', backgroundColor: '#E7F8EC' },
  [STATUS.Overpayment]: { color: '#4FD1C5', backgroundColor: '#EDFDFD' },
  [STATUS.Collection]: { color: '#9F7AEA', backgroundColor: '#FAF5FF' },
  [STATUS.Dispute]: { color: '#F687B3', backgroundColor: '#FFF5F7' },
  [STATUS.Cancel]: { color: '#F56565', backgroundColor: '#FFF5F7' },
  [STATUS.Expired]: { color: '#718096', backgroundColor: '#EDF2F7' },
  [STATUS.Inactive]: { color: '#ED64A6', backgroundColor: '#FFF5F7' },
  [STATUS.DoNotUse]: { color: '#F56565', backgroundColor: '#EBF8FF' },
  [STATUS.Decline]: { color: '#9F7AEA', backgroundColor: '#FFF5F7' },
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
}
