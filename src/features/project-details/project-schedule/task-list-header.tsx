import { FC } from 'react'
import { Grid, Text } from '@chakra-ui/react'

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

  return (
    <Grid
      gridTemplateColumns="1fr 1fr 1fr 1fr"
      width="420px"
      className={styles.ganttTable}
      alignItems="center"
      fontSize={props.fontSize}
      color="#4A5568"
      height={props.headerHeight}
    >
      <Text fontWeight={600} paddingLeft="13px">Name</Text>
      <Text fontWeight={600}>Trade</Text>
      <Text fontWeight={600}>Start Date</Text>
      <Text fontWeight={600}>End Date</Text>
    </Grid>
  )
}
