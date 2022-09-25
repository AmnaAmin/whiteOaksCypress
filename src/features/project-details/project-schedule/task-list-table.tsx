import React from 'react'
import { Box } from '@chakra-ui/react'
import { Task } from './task-types.ds'
import { dateFormat } from 'utils/date-time-utils'
import { MdOutlineArrowRight, MdOutlineArrowDropDown } from 'react-icons/md'
import { Tooltip } from '@chakra-ui/react'

const styles = {
  taskListWrapper: '_3ZbQT taskListWrapper',
  taskListTableRow: '_34SS0 taskListTableRow',
  taskListCell: '_3lLk3 taskListCell',
  taskListNameWrapper: '_nI1Xw taskListNameWrapper',
  taskListExpander: '_2QjE6 taskListExpander',
  taskListEmptyExpander: '_2TfEi taskListEmptyExpander',
}

const rowWidth = '105px'

const HeadingWithTooltip = ({ label }) => {
  return (
    <Tooltip label={label} color="black" backgroundColor="white" placement="top">
      <Box isTruncated>{label}</Box>
    </Tooltip>
  )
}

export const ProjectTaskListTable: React.FC<{
  rowHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
  tasks: Task[]
  selectedTaskId: string
  /**
   * Sets selected task by id
   */
  setSelectedTask: (taskId: string) => void
  onExpanderClick: (task: Task) => void
}> = props => {
  const tasks = props.tasks
  return (
    <Box
      fontSize={props.fontSize}
      fontWeight={600}
      color={'#4A5568'}
      width={'400px'}
      maxHeight={200}
      className={styles.taskListWrapper}
    >
      {tasks.length > 0 ? (
        <>
          {tasks.map(task => {
            let expanderSymbol = null
            if (task) {
              task.hideChildren ? <MdOutlineArrowRight /> : <MdOutlineArrowDropDown />
            }

            return (
              <Box
                key={task.name}
                className={styles.taskListTableRow}
                style={{
                  height: props.rowHeight,
                }}
              >
                <Box
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <Box className={styles.taskListNameWrapper}>
                    <Box
                      className={expanderSymbol ? styles.taskListExpander : styles.taskListEmptyExpander}
                      onClick={() => props.onExpanderClick?.(task)}
                    >
                      {expanderSymbol}
                    </Box>
                    <HeadingWithTooltip label={task.trade} />
                  </Box>
                </Box>
                <Box
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <HeadingWithTooltip label={task.name} />
                </Box>
                <Box
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <HeadingWithTooltip label={dateFormat(task?.start as Date)} />
                </Box>
                <Box
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <HeadingWithTooltip label={dateFormat(task?.end as Date)} />
                </Box>
              </Box>
            )
          })}
        </>
      ) : null}
    </Box>
  )
}
