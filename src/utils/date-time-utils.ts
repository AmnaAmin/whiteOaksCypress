import { format } from 'date-fns'
import sub from 'date-fns/sub'
import { range } from 'lodash'
import { GenericObjectType } from 'types/common.types'

export const dateFormat = (date: string | Date) => {
  if (date === null) return ''

  return date ? format(new Date(date), 'MM/dd/yyyy') : ''
}

export const datePickerFormat = (date: string | Date) => {
  if (date === null) return null

  return date ? format(new Date(date), 'yyyy-MM-dd') : null
}

export const dateISOFormat = (date: string | Date | null) => {
  if (date === null) return null

  const dateObj = new Date(date)

  // check is date is valid
  if (dateObj.toString() === 'Invalid Date') return null

  return dateObj?.toISOString() || null
}

export const dateISOFormatWithZeroTime = (date: string | Date | null) => {
  if (date === null) return null

  const dateObj = new Date(date)

  // check is date is valid
  if (dateObj.toString() === 'Invalid Date') return null

  return dateObj?.toISOString() || null
}

export const getFormattedDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (1 + date.getMonth()).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return month + '/' + day + '/' + year
}

/**
 * Returns a date with localized midnight timestamp
 * by adjusting the UTC minutes with timezoneOffset
 * @param date string
 * @returns
 */
export const getLocalTimeZoneDate = (date: string) => {
  if (!date) return null
  const dateObj = new Date(date)
  dateObj.setUTCMinutes(dateObj.getTimezoneOffset())
  return datePickerFormat(dateObj)
}

export type MonthOption = {
  value: number
  month: string
  label: string
  year: string
}

export const monthOptions: MonthOption[] = range(12).map(n => ({
  value: n,
  label: format(sub(new Date(), { months: n }), 'MMMM'),
  year: format(sub(new Date(), { months: n }), 'yyyy'),
  month: format(sub(new Date(), { months: n }), 'MM'),
}))

export const convertDateTimeFromServer = (date: string) => {
  return date ? format(new Date(date), 'MM/dd/yyyy') : null
}

export const convertDateTimeToServer = (date: Date) => {
  return date ? new Date(format(new Date(date), 'MM/dd/yyyy')) : null
}

export const customFormat = (date: Date, dateFormat: string) => {
  return date ? format(new Date(date), dateFormat) : null
}

export const dateFormatter = d => {
  const date = new Date(String(d))
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  return formattedDate
}

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export const monthsShort: GenericObjectType = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
}
