import React from 'react'
import { ViewMode } from 'gantt-task-react'
import { Box } from '@chakra-ui/react'
import { Button } from 'components/button/button'

type ViewSwitcherProps = {
  viewMode: ViewMode,
  onViewModeChange: (viewMode: ViewMode) => void
}
type viewFilter = {
  label: string,
  value: ViewMode
}
const viewFilters:viewFilter[] = [
  {
    label: 'Hour',
    value: ViewMode.Hour,
  },
  {
    label: 'Quarter of Day',
    value: ViewMode.QuarterDay,
  },
  {
    label: 'Half of Day',
    value: ViewMode.HalfDay
  },
  {
    label: 'Day',
    value: ViewMode.Day,
  },
  {
    label: 'Week',
    value: ViewMode.Week,
  },
  {
    label: 'Month',
    value: ViewMode.Month,
  },
  {
    label: 'Year',
    value: ViewMode.Year,
  },
]

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <Box className="ViewContainer" gridGap={4}>
      {viewFilters.map((view) => {
        return (
          <Button
            key={view.value}
            isActive={viewMode === view.value}
            onClick={() => onViewModeChange(view.value)}
          >
            {view.label}
          </Button>
        );
      })}
    </Box>
  )
}
