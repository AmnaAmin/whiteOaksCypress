import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { ViewMode, Gantt } from 'gantt-task-react'
import { Task } from './task-types.ds'
import { ProjectTaskList } from './task-list-header'
import { ProjectTaskListTable } from './task-list-table'
import 'gantt-task-react/dist/index.css'
import './gantt-task.css'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from 'features/common/error-fallback'

const getColumnWidth = (view: ViewMode) => {
  switch (true) {
    case view === ViewMode.Year || view === ViewMode.Month:
      return 450
    case view === ViewMode.Week:
      return 150
    default:
      return 65
  }
}

const ProjectScheduleDetails: React.FC<{
  data: Task[]
}> = ({ data }) => {
  const [tasks, setTasks] = React.useState<Task[]>(
    data.map(t => {
      /*if ( t.start.getTime() <= 0 || t.end.getTime() <= 0 ){
        t.start = new Date()
        t.end = new Date()
      }*/
      if (t.end < t.start) {
        t.end = t.start
      }

      return t
    }),
  )

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)))
  }

  useEffect(() => {
    if (data.length > 0) {
      setTasks(
        data.map(t => {
          if (!t.start.getTime() || !t.end.getTime()) {
            t.start = new Date()
            t.end = new Date()
          }

          if (t.end < t.start) {
            t.end = t.start
          }

          return t
        }),
      )
    }
  }, [data])

  return (
    <Flex className="project-details-chart" direction={'column'} gridGap={4}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Gantt
          tasks={tasks}
          headerHeight={45}
          columnWidth={getColumnWidth(ViewMode.Day)}
          rowHeight={27}
          handleWidth={0}
          fontSize="13px"
          barFill={60}
          viewMode={ViewMode.Day}
          onExpanderClick={handleExpanderClick}
          TaskListHeader={ProjectTaskList}
          TaskListTable={ProjectTaskListTable}
        />
      </ErrorBoundary>
    </Flex>
  )
}

export default ProjectScheduleDetails
