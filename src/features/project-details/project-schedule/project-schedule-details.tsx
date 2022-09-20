import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { Task, ViewMode, Gantt } from 'gantt-task-react'
import { ProjectTaskList } from './task-list-header'
import { ProjectTaskListTable } from './task-list-table'
import { useColumnWidth } from './hooks'
import { ViewSwitcher } from 'components/gantt-chart/view-switcher'
import 'gantt-task-react/dist/index.css'
import './gantt-task.css'

const ProjectScheduleDetails: React.FC<{
  data: Task[]
}> = ({ data }) => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Week)
  const [tasks, setTasks] = React.useState<Task[]>(data)
  const columnWidth = useColumnWidth(view);

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)))
  }

  useEffect(() => {
    if (data.length > 0) {
      setTasks(data)
    }
  }, [data])

  return (
    <Flex
      className="Wrapper ProjectDetails_Chart"
      direction={"column"}
      gridGap={4}
    >
      <ViewSwitcher
        viewMode={view}
        onViewModeChange={viewMode => setView(viewMode)}
      />
      <Gantt
        tasks={tasks}
        headerHeight={35}
        columnWidth={columnWidth}
        rowHeight={27}
        handleWidth={0}
        fontSize="13px"
        barFill={60}
        viewMode={view}
        onExpanderClick={handleExpanderClick}
        TaskListHeader={ProjectTaskList}
        TaskListTable={ProjectTaskListTable}
      />
    </Flex>
  )
}

export default ProjectScheduleDetails
