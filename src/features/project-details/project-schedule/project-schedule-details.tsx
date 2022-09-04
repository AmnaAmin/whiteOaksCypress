import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { Task, ViewMode, Gantt } from 'gantt-task-react'
import { getStartEndDateForProject } from './helper'
import { ProjectTaskList } from './task-list-header'
import { ProjectTaskListTable } from './task-list-table'
import { useColumnWidth } from './hooks'
import { ViewSwitcher } from 'components/gantt-chart/view-switcher'
import 'gantt-task-react/dist/index.css'
import './gantt-task.css'

const ProjectScheduleDetails: React.FC<{
  data: Task[]
}> = ({ data }) => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day)
  const [tasks, setTasks] = React.useState<Task[]>(data)
  const columnWidth = useColumnWidth(view);

  const handleTaskChange = (task: Task) => {
    let newTasks = tasks.map(t => (t.id === task.id ? task : t))
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project)
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)]
      if (project.start.getTime() !== start.getTime() || project.end.getTime() !== end.getTime()) {
        const changedProject = { ...project, start, end }
        newTasks = newTasks.map(t => (t.id === task.project ? changedProject : t))
      }
    }
    setTasks(newTasks)
  }

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)))
  }

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
        rowHeight={30}
        viewMode={view}
        ganttHeight={150}
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onExpanderClick={handleExpanderClick}
        TaskListHeader={ProjectTaskList}
        // TaskListHeader={ProjectTaskList}
        // TaskListTable={ProjectTaskListTable}
        // projectProgressSelectedColor="#4E87F8"
        // projectProgressColor="#4E87F8"
        // barProgressColor="#4E87F8"
        // barCornerRadius={32}
        columnWidth={columnWidth}
      />
    </Flex>
  )
}

export default ProjectScheduleDetails
