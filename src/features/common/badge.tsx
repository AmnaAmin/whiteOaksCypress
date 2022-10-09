import { Tag, TagLabel } from '@chakra-ui/react'

export enum BADGE {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Platinum = 'platinum',
  None = 'none',
}

const BADGE_COLOR = {
  [BADGE.Bronze]: { color: '#C05621', backgroundColor: '#FEEBCB ' },
  [BADGE.Silver]: { color: '#2B6CB0', backgroundColor: '#EBF8FF' },
  [BADGE.Gold]: { color: '#B7791F', backgroundColor: '#FEFCBF' },
  [BADGE.Platinum]: { color: '#9F7AEA ', backgroundColor: '#FFF5F7' },
  [BADGE.None]: { color: '#ED8936 ', backgroundColor: '#FEEBCB' },
}

const Badge = ({ value = '', id = '' }: { value?: string; id?: string }) => {
  const style = BADGE_COLOR[id?.toLocaleLowerCase()]

  return (
    <Tag size="md" rounded="6px" variant="solid" backgroundColor={style?.backgroundColor} color={style?.color}>
      <TagLabel fontSize="14px" fontStyle="normal" fontWeight={400} p="2px 10px 2px 10px" textTransform="capitalize">
        {value?.toLocaleLowerCase()}
      </TagLabel>
    </Tag>
  )
}

export default Badge
