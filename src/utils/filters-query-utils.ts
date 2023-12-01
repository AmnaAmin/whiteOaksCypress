import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { dateISOFormatWithZeroTime } from './date-time-utils'

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
  let modifiedFilters = [] as any
  columnFilters?.forEach(filter => {
    // change to iso format if we have date and value is not specified 0 or 1.
    // Dates will have value 0 or 1 if we have to null check the field
    if (filter?.id?.toLocaleLowerCase()?.includes('date') && !['0', '1']?.includes(filter?.value as string)) {
      if (
        [
          'clientStartDate',
          'clientDueDate',
          'clientWalkthroughDate',
          'clientSignoffDate',
          'expectedPayDate',
          'workOrderStartDate',
          'gridExpectedPaymentDate',
          'expectedPaymentDate',
          'workOrderDateCompleted',
          'newExpectedCompletionDate',
          'coiglExpirationDate',
          'coiWcExpirationDate',
          'woaStartDate',
          'lienRightExpireDate',
        ].includes(filter.id)
      ) {
        modifiedFilters.push(
          ...[
            {
              id: filter.id + 'Start',
              value: (filter?.value as string)?.split(' - ')?.[0],
            },
            {
              id: filter.id + 'End',
              value: (filter?.value as string)?.split(' - ')?.[1],
            },
          ],
        )
      } else {
        modifiedFilters.push(
          ...[
            {
              id: filter.id + 'Start',
              value: filter?.value ? dateISOFormatWithZeroTime((filter?.value as string)?.split(' - ')?.[0]) : null,
            },
            {
              id: filter.id + 'End',
              value: filter?.value ? dateISOFormatWithZeroTime((filter?.value as string)?.split(' - ')?.[1]) : null,
            },
          ],
        )
      }
    } else {
      modifiedFilters.push(filter)
    }
  })

  const filterKeyValues = reduceQueriesArrayToObject(modifiedFilters, 'id', 'value', queryAndTableColumnMapKeys || {})
  return getQueryString({
    ...filterKeyValues,
    page: page || 0,
    size: size || 100000,
    sort: sorting && sorting?.length > 0 ? `${sorting?.[0]?.id},${sorting?.[0]?.desc ? 'desc' : 'asc'}` : 'id,desc', //{accessor},{direction}
  })
}
