import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Task, ViewMode, Gantt } from 'gantt-task-react'
import { ViewSwitcher } from './view-switcher'
import { getStartEndDateForProject, initTasks } from './helper'
import { ProjectTaskList } from './task-list-header'
import { ProjectTaskListTable } from './task-list-table'
import { useColumnWidth } from './hooks'
import 'gantt-task-react/dist/index.css'
import './gantt-task.css'

const ProjectScheduleDetails: React.FC<{
  data: Task[]
}> = ({ data }) => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day)
  const [tasks, setTasks] = React.useState<Task[]>(initTasks())
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
    <Box className="Wrapper ProjectDetails_Chart">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
      />
      <Gantt
        tasks={tasks}
        rowHeight={80}
        viewMode={view}
        ganttHeight={tasks.length === 2 ? 160 : 255}
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onExpanderClick={handleExpanderClick}
        listCellWidth={'155px'}
        TaskListHeader={ProjectTaskList}
        TaskListTable={ProjectTaskListTable}
        projectProgressSelectedColor="#4E87F8"
        projectProgressColor="#4E87F8"
        barProgressColor="#4E87F8"
        barCornerRadius={32}
        columnWidth={columnWidth}
      />
    </Box>
  )
}

export default ProjectScheduleDetails
