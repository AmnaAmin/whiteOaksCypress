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
}

const STATUS_COLOR = {
  [STATUS.Paid]: { color: '#6B46C1', backgroundColor: '#E9D8FD' },
  [STATUS.Active]: { color: '#2AB450', backgroundColor: '#E7F8EC' },
  [STATUS.Approved]: { color: '#2AB450', backgroundColor: '#E7F8EC' },
  [STATUS.Completed]: { color: '#2B6CB0', backgroundColor: '#BEE3F8' },
  [STATUS.PastDue]: { color: '#C05621', backgroundColor: '#FEEBCB' },
  [STATUS.Pending]: { color: '#C05621', backgroundColor: '#FEEBCB' },
  [STATUS.Denied]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Cancelled]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
  [STATUS.Invoiced]: { color: '#E53E3E', backgroundColor: '#FED7D7' },
}

const Status = ({ value, id }: { value: string; id: string }) => {
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
