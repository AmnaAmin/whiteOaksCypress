import { useEffect, useState } from "react"
import { ViewMode } from 'gantt-task-react'

export const useColumnWidth = (view) => {
  const [columnWidth, setColumnWidth] = useState(0)

  useEffect(() => {
    switch(view) {
      case view === ViewMode.Year:
        setColumnWidth(350);
        break;
      case view === ViewMode.Month:
        setColumnWidth(300);
        break;
      case view === ViewMode.Week:
        setColumnWidth(250);
        break;
      default:
        setColumnWidth(65)
    }
  },[view])

  return columnWidth;
}