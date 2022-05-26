import React from 'react'
import { Tag, TagLabel } from '@chakra-ui/react'

export enum STATUS {
  Paid = 'paid',
  Active = 'active',
  Approved = 'approved',
  Completed = 'completed',
  PastDue = 'past due',
  Pending = 'pending',
  Denied = 'denied',
  Cancelled = 'cancelled',
  Invoiced = 'Invoiced',
  Punch = 'punch',
  New = 'new',
  Closed = 'closed',
  ClientPaid = 'client paid',
  Overpayment = 'overpayment',
  Collection = 'collection',
  Dispute = 'dispute',
  Cancel = 'cancel',
}

const STATUS_COLOR = {
  [STATUS.Paid]: { color: '#6B46C1', backgroundColor: '#E9D8FD' },
  [STATUS.Active]: { color: '#63B3ED', backgroundColor: '#EBF8FF' },
  [STATUS.Approved]: { color: '#2AB450', backgroundColor: '#E7F8EC' },
  [STATUS.Completed]: { color: '#2B6CB0', backgroundColor: '#BEE3F8' },
  [STATUS.PastDue]: { color: '#ED8936', backgroundColor: '#FCE8D8' },
  [STATUS.Pending]: { color: '#C05621', backgroundColor: '#FEEBCB' },
  [STATUS.Denied]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Cancelled]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Invoiced]: { color: '#48BB78', backgroundColor: '#E2EFDF' },
  [STATUS.Punch]: { color: '#F687B3', backgroundColor: '#FAE6E5' },
  [STATUS.New]: { color: '#ED8936', backgroundColor: '#FEEBCB' },
  [STATUS.Closed]: { color: '#B794F4', backgroundColor: '#E5ECF9' },
  [STATUS.ClientPaid]: { color: '#48BB78', backgroundColor: '#E7F8EC' },
  [STATUS.Overpayment]: { color: '#4FD1C5', backgroundColor: '#EDFDFD' },
  [STATUS.Collection]: { color: '#9F7AEA', backgroundColor: '#FAF5FF' },
  [STATUS.Dispute]: { color: '#F687B3', backgroundColor: '#FFF5F7' },
  [STATUS.Cancel]: { color: '#F56565', backgroundColor: '#FFF5F7' },
}

const Status = ({ value = '', id = '' }: { value?: string; id?: string }) => {
  const style = STATUS_COLOR[id?.toLocaleLowerCase()]

  return (
    <Tag size="md" rounded="6px" variant="solid" backgroundColor={style?.backgroundColor} color={style?.color}>
      <TagLabel
        fontSize="14px"
        fontStyle="normal"
        fontWeight={400}
        lineHeight="20px"
        p="2px"
        textTransform="capitalize"
      >
        {value?.toLocaleLowerCase()}
      </TagLabel>
    </Tag>
  )
}

export default Status
