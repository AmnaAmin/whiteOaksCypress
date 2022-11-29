import { Tag, TagLabel } from '@chakra-ui/react'

export const StatusUserMgt = ({ id }: { id?: boolean }) => {
  const labelText = id ? 'Activated' : 'Deactivate'

  return (
    <Tag
      data-testid="status"
      size="md"
      rounded="6px"
      variant="solid"
      backgroundColor={id ? '#EBF8FF' : '#FFF5F7'}
      color={id ? '#63B3ED' : '#F56565'}
    >
      <TagLabel fontSize="14px" fontStyle="normal" fontWeight={400} p="2px 10px 2px 10px" textTransform="capitalize">
        {labelText?.toLocaleLowerCase()}
      </TagLabel>
    </Tag>
  )
}
