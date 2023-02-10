import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { dateISOFormatWithZeroTime, datePickerFormat } from './date-time-utils'

export const getQueryString = (obj: { [key: string]: string | number | undefined }) => {
  return Object.keys(obj).reduce((str, key, i) => {
    const delimiter = i === 0 ? '' : '&'
    const val = obj[key]

    return val || val === 0 ? `${str}${delimiter}${key}=${val}` : str
  }, '')
}

const reduceQueriesArrayToObject = (
  columnFilters: ColumnFiltersState,
  key: string,
  valueKey: string,
  queryKeyValues: { [key: string]: string },
) => {
  return columnFilters?.reduce((obj, item) => {
    const dateFilter = item.id.includes('Date') || item.id.includes('date')
    obj[queryKeyValues[item[key]]] = dateFilter ? item[valueKey] : window.encodeURIComponent(item[valueKey])
    return obj
  }, {})
}

export const getAPIFilterQueryString = (
  page?: number,
  size?: number,
  columnFilters?: ColumnFiltersState,
  queryAndTableColumnMapKeys?: { [key: string]: string },
  sorting?: SortingState,
) => {
  const dateToISOFormatFilters =
    columnFilters?.map(filter => {
      // change to iso format if we have date and value is not specified 0 or 1.
      // Dates will have value 0 or 1 if we have to null check the field
      if (filter?.id?.includes('Date') && !['0', '1']?.includes(filter?.value as string)) {
        if (
          [
            'clientStartDate',
            'clientDueDate',
            'clientWalkThroughDate',
            'clientSignoffDate',
            'expectedPayDate',
            'workOrderStartDate',
            'workOrderExpectedCompletionDate',
            'workOrderDateCompleted',
            'expectedPaymentDate',
            'newExpectedCompletionDate',
            'coiglExpirationDate',
            'coiWcExpirationDate',
          ].includes(filter.id)
        ) {
          return {
            ...filter,
            value: filter.value ? datePickerFormat(filter.value as string) : null,
          }
        }
        return {
          ...filter,
          value: filter.value ? dateISOFormatWithZeroTime(filter.value as string) : null,
        }
      }

      return filter
    }) || []

  const filterKeyValues = reduceQueriesArrayToObject(
    dateToISOFormatFilters,
    'id',
    'value',
    queryAndTableColumnMapKeys || {},
  )

  return getQueryString({
    ...filterKeyValues,
    page: page || 0,
    size: size || 100000,
    sort: sorting && sorting?.length > 0 ? `${sorting?.[0]?.id},${sorting?.[0]?.desc ? 'desc' : 'asc'}` : 'id,desc', //{accessor},{direction}
  })
}
