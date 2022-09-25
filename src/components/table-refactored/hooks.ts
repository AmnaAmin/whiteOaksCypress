import { ColumnFiltersState, PaginationState } from '@tanstack/react-table'
import { useWeekDayProjectsDue } from 'api/projects'
import { useState, useMemo, useEffect } from 'react'
import { getAPIFilterQueryString } from 'utils/filters-query-utils'

type UseColumnFiltersQueryStringProps = {
  queryStringAPIFilterKeys: { [key: string]: string }
  pagination?: PaginationState
  setPagination?: (pagination: PaginationState) => void
  selectedCard?: string
  selectedDay?: string
  selectedFPM?: any
  userIds?: number[]
}
export const useColumnFiltersQueryString = (options: UseColumnFiltersQueryStringProps) => {
  const { queryStringAPIFilterKeys, pagination, setPagination, selectedCard, selectedDay, userIds, selectedFPM } =
    options
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { data: days } = useWeekDayProjectsDue(selectedFPM?.id)

  const fitlersQueryString = useMemo(() => {
    let projectStatusFilter
    let clientDueDateFilter
    let finalFilters: ColumnFiltersState = [...columnFilters]

    // This filter will apply when user select a card from the card list
    if (selectedCard) {
      projectStatusFilter =
        selectedCard !== 'past due' ? { id: 'projectStatus', value: selectedCard } : { id: 'pastDue', value: true }
      finalFilters = [...columnFilters, projectStatusFilter]
    }

    // This filter will apply when user select a day from the project due days list
    if (selectedDay && days?.length) {
      const selectedDayData = days.find(day => day.dayName === selectedDay)
      clientDueDateFilter = { id: 'clientDueDate', value: selectedDayData?.dueDate }
      finalFilters = [...columnFilters, clientDueDateFilter]
    }

    // This filter will apply when user select a FPM from the FPM list
    if (userIds?.length) {
      finalFilters = [...finalFilters, { id: 'projectManagerId', value: userIds.join(',') }]
    }

    return getAPIFilterQueryString(pagination?.pageIndex, pagination?.pageSize, finalFilters, queryStringAPIFilterKeys)
  }, [selectedCard, selectedDay, columnFilters, pagination, userIds])

  useEffect(() => {
    if (!pagination) return

    if (selectedCard || selectedDay || userIds) {
      setPagination?.({ ...pagination, pageIndex: 0 })
    }
  }, [columnFilters, selectedCard, selectedDay, userIds])

  return {
    columnFilters,
    setColumnFilters,
    fitlersQueryString,
  }
}
