import { ColumnFiltersState, PaginationState } from '@tanstack/react-table'
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
  days?: any
}
export const useColumnFiltersQueryString = (options: UseColumnFiltersQueryStringProps) => {
  const { queryStringAPIFilterKeys, pagination, setPagination, selectedCard, selectedDay, userIds, days } = options
  const { pageIndex, pageSize } = pagination || {}

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const fitlersQueryString = useMemo(() => {
    let projectStatusFilter
    let clientDueDateFilter
    let finalFilters: ColumnFiltersState = [...columnFilters]

    // This filter will apply when user select a card from the card list
    if (selectedCard) {
      if (selectedCard === 'past due') {
        const pastDueFilters = [{ id: 'pastDue', value: '1' }]
        finalFilters = [...finalFilters, ...pastDueFilters]

        // Account Payable Cards contains 1, 2, 3, 4, 5, 6, which represents
        // past due, 7 days, 14 days, 20 days, 30 days, and overpayment
      } else if (['1', '2', '3', '4', '5', '6'].includes(selectedCard)) {
        const durationCategoryFilters = [{ id: 'durationCategory', value: selectedCard }]
        finalFilters = [...finalFilters, ...durationCategoryFilters]
      } else {
        projectStatusFilter =
          selectedCard !== 'past due' ? { id: 'projectStatus', value: selectedCard } : { id: 'pastDue', value: true }
        finalFilters = [...columnFilters, projectStatusFilter]
      }
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

    const queryStringWithoutPagination = getAPIFilterQueryString(0, 10000000, finalFilters, queryStringAPIFilterKeys)
    const queryStringWithPagination = getAPIFilterQueryString(
      pageIndex,
      pageSize,
      finalFilters,
      queryStringAPIFilterKeys,
    )
    return {
      queryStringWithoutPagination,
      queryStringWithPagination,
    }
  }, [selectedCard, selectedDay, columnFilters, pageIndex, pageSize, userIds, days])

  useEffect(() => {
    if (!pagination) return

    if (selectedCard || selectedDay || userIds || columnFilters?.length > 0) {
      setPagination?.({ ...pagination, pageIndex: 0 })
    }
  }, [columnFilters, selectedCard, selectedDay, userIds])

  return {
    columnFilters,
    setColumnFilters,
    ...fitlersQueryString,
  }
}
