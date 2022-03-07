import React from 'react';
import { Tag, TagLabel } from '@chakra-ui/react';

enum WORK_ORDER_STATUS {
  Paid = 68,
  Active = 34,
  Completed = 36,
}

const WORK_ORDER_STATUS_COLOR = {
  [WORK_ORDER_STATUS.Paid]: { color: '#6B46C1', backgroundColor: '#E9D8FD' },
  [WORK_ORDER_STATUS.Active]: { color: '#2AB450', backgroundColor: '#E7F8EC' },
  [WORK_ORDER_STATUS.Completed]: { color: '#2B6CB0', backgroundColor: '#BEE3F8' },
};

const WorkOrderStatus = ({ value, id }: { value: string; id: string }) => {
  return (
    <Tag
      size="lg"
      borderRadius="full"
      variant="solid"
      backgroundColor={WORK_ORDER_STATUS_COLOR[id]?.backgroundColor ?? '#6B46C1'}
      color={WORK_ORDER_STATUS_COLOR[id]?.color ?? '#E9D8FD'}
    >
      <TagLabel>{value}</TagLabel>
    </Tag>
  );
};

export default WorkOrderStatus;
