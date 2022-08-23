import React from 'react'
import { Tag, TagLabel } from '@chakra-ui/react'

export enum WORK_ORDER_STATUS {
  Paid = 68,
  Active = 34,
  Completed = 36,
  Cancelled = 35,
  Inactive = 37,
  Invoiced = 110,
  Decline = 111,
  PastDue = 114,
}

const WORK_ORDER_STATUS_COLOR = {
  [WORK_ORDER_STATUS.Paid]: { color: '#6B46C1', backgroundColor: '#E9D8FD' },
  [WORK_ORDER_STATUS.Active]: { color: '#2AB450', backgroundColor: '#E7F8EC' },
  [WORK_ORDER_STATUS.Completed]: { color: '#2B6CB0', backgroundColor: '#BEE3F8' },
}

const WorkOrderStatus = ({ value, id }: { value: string; id: string }) => {
  return (
    <Tag
      size="md"
      borderRadius="6px"
      variant="solid"
      backgroundColor={WORK_ORDER_STATUS_COLOR[id]?.backgroundColor ?? 'red.100'}
      color={WORK_ORDER_STATUS_COLOR[id]?.color ?? 'red.400'}
    >
      <TagLabel data-testid="status" fontSize="14px" fontWeight={400} fontStyle="normal" lineHeight="20px" p="3px">
        {value}
      </TagLabel>
    </Tag>
  )
}

export default WorkOrderStatus
