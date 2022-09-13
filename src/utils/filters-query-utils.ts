import { ColumnFiltersState } from '@tanstack/react-table'
import { dateISOFormat } from './date-time-utils'

const getQueryString = (obj: { [key: string]: string | number }) => {
  return Object.keys(obj).reduce((str, key, i) => {
    const delimiter = i === 0 ? '' : '&'
    const val = obj[key]
    return val ? `${str}${delimiter}${key}=${val}` : str
  }, '')
}

const reduceQueriesArrayToObject = (
  columnFilters: ColumnFiltersState,
  key: string,
  valueKey: string,
  queryKeyValues: { [key: string]: string },
) => {
  return columnFilters?.reduce((obj, item) => {
    obj[queryKeyValues[item[key]]] = item[valueKey]
    return obj
  }, {})
}

export const getAPIFilterQueryString = (
  page?: number,
  size?: number,
  columnFilters?: ColumnFiltersState,
  queryAndTableColumnMapKeys?: { [key: string]: string },
) => {
  const dateToISOFormatFilters =
    columnFilters?.map(filter => {
      if (filter?.id?.includes('Date')) {
        return {
          ...filter,
          value: filter.value ? dateISOFormat(filter.value as string) : null,
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
    sort: 'id,asc',
  })
}
