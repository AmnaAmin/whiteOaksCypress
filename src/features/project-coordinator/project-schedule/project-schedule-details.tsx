import React, { useEffect } from 'react'
import { Task, ViewMode, Gantt } from 'gantt-task-react'
import { ViewSwitcher } from './view-switcher'
import { getStartEndDateForProject, initTasks } from './helper'
import { ProjectTaskList } from './task-list-header'
import { ProjectTaskListTable } from './task-list-table'
import './gantt-task.css'

// Init
const ProjectScheduleDetails: React.FC<{
  data: Task[]
}> = ({ data }) => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day)
  const [tasks, setTasks] = React.useState<Task[]>(initTasks())
  const [isChecked, setIsChecked] = React.useState(true)
  let columnWidth = 65
  if (view === ViewMode.Year) {
    columnWidth = 350
  } else if (view === ViewMode.Month) {
    columnWidth = 300
  } else if (view === ViewMode.Week) {
    columnWidth = 250
  }

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
    <div className="Wrapper ProjectDetails_Chart">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt
        tasks={tasks}
        rowHeight={80}
        viewMode={view}
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? '155px' : ''}
        TaskListHeader={ProjectTaskList}
        TaskListTable={ProjectTaskListTable}
        projectProgressSelectedColor="#4E87F8"
        projectProgressColor="#4E87F8"
        barProgressColor="#4E87F8"
        barCornerRadius={32}
        columnWidth={columnWidth}
      />
    </div>
  )
}

export default ProjectScheduleDetails
