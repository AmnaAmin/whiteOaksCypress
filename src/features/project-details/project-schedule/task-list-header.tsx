import { FC } from 'react'
import { Flex } from '@chakra-ui/react'

const styles = { ganttTable: '_3_ygE' }

/**
 * A component taken out of react-gantt-task lib's codebase (originally called 'TaskListHeaderDefault')
 * This allows us to create a custom component for the Task List Header Area
 * @param props Tasl List props [headerHeight, rowWidth, fontFamily, fontSize]
 * @returns React Component
 */
export const ProjectTaskList: FC<{
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
}> = props => {
  const headerHeight = props.headerHeight

  return (
    <Flex
      fontFamily={props.fontFamily}
      fontSize={14}
      fontWeight={600}
      color={'#4A5568'}
      alignItems={'center'}
      justifyContent={'center'}
      paddingLeft={'13px'}
      className={styles.ganttTable}
      style={{
        height: headerHeight,
      }}
    />
  )
}
