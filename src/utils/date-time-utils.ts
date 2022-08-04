import { format } from 'date-fns'
import sub from 'date-fns/sub'
import { range } from 'lodash'

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

  return date ? new Date(date).toISOString() : null
}

export const getFormattedDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (1 + date.getMonth()).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return month + '/' + day + '/' + year
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
