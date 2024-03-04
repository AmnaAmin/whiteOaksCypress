import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table'
import { useState, useMemo, useEffect } from 'react'
import { getAPIFilterQueryString } from 'utils/filters-query-utils'
import { datePickerFormat } from 'utils/date-time-utils'
import { FlagEnum } from 'features/common/project-card'

type UseColumnFiltersQueryStringProps = {
  queryStringAPIFilterKeys: { [key: string]: string }
  pagination?: PaginationState
  setPagination?: (pagination: PaginationState) => void
  selectedCard?: string
  selectedDay?: string
  userIds?: any
  days?: any
  sorting?: SortingState
  selectedFlagged?: any
  selectedPreInvoice?: boolean
}
export const useColumnFiltersQueryString = (options: UseColumnFiltersQueryStringProps) => {
  const {
    queryStringAPIFilterKeys,
    pagination,
    setPagination,
    selectedCard,
    selectedDay,
    userIds,
    days,
    sorting,
    selectedFlagged,
    selectedPreInvoice,
  } = options
  const { pageIndex, pageSize } = pagination || {}

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const fitlersQueryString = useMemo(() => {
    let projectStatusFilter
    let clientDueDateFilter
    let finalFilters: ColumnFiltersState = [...columnFilters]

    // This filter will apply when user select a card from the card list
    if (!!selectedCard) {
      if (selectedCard === 'past due') {
        const pastDueFilters = [{ id: 'pastDue', value: '1' }]
        const projectStatusValue = columnFilters?.find(c => c.id === 'projectStatus')?.value
        const projectStatus = [{ id: 'projectStatus', value: projectStatusValue ?? 'new,active,punch' }]

        finalFilters = [...finalFilters, ...pastDueFilters, ...projectStatus]

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
    if (selectedFlagged !== null && selectedFlagged?.length) {
      finalFilters = [
        ...columnFilters,
      ]
      if (selectedFlagged?.includes(FlagEnum.NOTES)) finalFilters.push({ id: 'noteFlag', value: "yes" });
      if (selectedFlagged?.includes(FlagEnum.LEIN_DUE_EXPIRY)) finalFilters.push({ id: 'lienDueFlag', value: "yes" });
      if (selectedFlagged?.includes(FlagEnum.ALL)) finalFilters.push({ id: 'flagCheck', value: "yes" });
    }

    if (selectedPreInvoice) {
      finalFilters = [
        ...columnFilters,
        { id: 'preInvoiced', value: selectedPreInvoice},
      ]
    }

    // This filter will apply when user select a day from the project due days list
    if (!!selectedDay && days?.length) {
      const selectedDayData = days.find(day => day.dayName === selectedDay)

      if (selectedDayData) {
        const startDate = datePickerFormat(selectedDayData.dueDate)
        const endDate = datePickerFormat(selectedDayData.dueDate)

        clientDueDateFilter = {
          id: 'clientDueDate',
          value: `${startDate} - ${endDate}`,
        }

        finalFilters = [...finalFilters, clientDueDateFilter];
      }
    }
    // This filter will apply when user select a FPM from the FPM list
    if (userIds?.length > 0) {
      finalFilters = [...finalFilters, { id: 'pcOrFpmUserId', value: userIds?.join(',') }]
    } else {
      finalFilters = finalFilters?.filter(f => f.id !== 'pcOrFpmUserId')
    }

    const queryStringWithoutPagination = getAPIFilterQueryString(
      0,
      10000000,
      finalFilters,
      queryStringAPIFilterKeys,
      sorting,
    )
    const queryStringWithPagination = getAPIFilterQueryString(
      pageIndex,
      pageSize,
      finalFilters,
      queryStringAPIFilterKeys,
      sorting,
    )
    return {
      queryStringWithoutPagination,
      queryStringWithPagination,
    }
  }, [selectedCard, selectedDay, columnFilters, pageIndex, pageSize, userIds, days, sorting, selectedFlagged, selectedPreInvoice])

  useEffect(() => {
    if (!pagination) return

    if (selectedCard || selectedDay || userIds || columnFilters?.length > 0 || selectedFlagged) {
      setPagination?.({ ...pagination, pageIndex: 0 })
    }
  }, [columnFilters, selectedCard, selectedDay, userIds, selectedFlagged, selectedPreInvoice])

  return {
    columnFilters,
    setColumnFilters,
    ...fitlersQueryString,
  }
}
