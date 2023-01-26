import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import sub from 'date-fns/sub'
import { range } from 'lodash'
import { GenericObjectType } from 'types/common.types'
import moment from 'moment'

//  const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
//  const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
//  const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm'
const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z'
//  const APP_WHOLE_NUMBER_FORMAT = '0,0';
//  const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';

export const convertDateTimeFromServer = date => (date ? moment(date).format(APP_LOCAL_DATETIME_FORMAT) : null)

export const convertDateTimeToServer = date => (date ? moment(date, APP_LOCAL_DATETIME_FORMAT_Z).toDate() : null)

export const dateFormat = (date: string | Date) => {
  if (date === null) return ''

  return date ? format(new Date(date), 'MM/dd/yyyy') : ''
}

export const dateFormatNew = (date: string | Date) => {

  if (date === null) return ''

  if ( typeof date === "object" ) {
    date = date.toString().replace("Z","");
  }

  if ( typeof date === "string" ) {
    console.log("Date: ", date);

    if ( date.indexOf("Z") === -1 && date.indexOf("T") === -1 ) {
      date = date+"T00:00:00";
    } else {
      date = date.replace("Z","");
    }
    
    console.log("After Date: ", date);
  }

  return date ? format(new Date(date), 'MM/dd/yyyy') : ''
}

export const datePickerFormat = (date: any) => {
  if (date === null || date === undefined) return null

  if ( typeof date === "object" ) {
    date = date.toString().replace("Z","");
  }

  if ( typeof date === "string" ) {
    date = date.replace("Z","");
  }

  //console.log( "Date : ", date );
  // new Date() makes a day lesser based on time zone. Hence avoiding that by using moment.
  // return date ? format(new Date(date.replace(/-/g, '\/')), 'yyyy-MM-dd') : null
  return date ? moment(date).format('YYYY-MM-DD') : null
}

export const dateISOFormat = (date: string | Date | null) => {
  if (date === null) return null

  const dateObj = new Date(date)

  // check is date is valid
  if (dateObj.toString() === 'Invalid Date') return null

  return dateObj.toISOString()
}

export const dateISOFormatWithZeroTime = (date: string | Date | null) => {
  if (date === null) return null

  const dateObj = new Date(date)

  // check is date is valid
  if (dateObj.toString() === 'Invalid Date') return null
  var isoFormatDate = format(new Date(date), 'yyyy-MM-dd') + 'T00:00:00.000Z'

  return isoFormatDate || null
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

monthOptions.unshift({
  value: 13,
  label: 'All',
  year: '-1',
  month: '-1',
})

// export const convertDateTimeFromServer = (date: string) => {
//   return date ? format(new Date(date), 'MM/dd/yyyy') : null
// }

export const convertDateWithTimeStamp = (date: string) => {
  return date ? format(new Date(date), 'Pp', { locale: enUS }) : null
}

// export const convertDateTimeToServer = (date: Date) => {
//   return date ? new Date(format(new Date(date), 'MM/dd/yyyy')) : null
// }

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

export const monthsFull: GenericObjectType = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
}

export const getQuarterByDate = (date = new Date()) => {
  return getQuarterByMonth(date.getMonth())
}

export const getLastQuarterByDate = (date = new Date()) => {
  return getQuarterByMonth(date.getMonth() - 3)
}

export const getQuarterByMonth = (month: number) => {
  return Math.floor(month / 3 + 1)
}

export const year = format(sub(new Date(), { months: 0 }), 'yyyy')

export const monthOptionsPaidGraph = [
  { value: 13, label: 'All', year: '-1', month: '-1' },
  { value: 1, label: 'January', year: year, month: '1' },
  { value: 2, label: 'February', year: year, month: '2' },
  { value: 3, label: 'March', year: year, month: '3' },
  { value: 4, label: 'April', year: year, month: '4' },
  { value: 5, label: 'May', year: year, month: '5' },
  { value: 6, label: 'June', year: year, month: '6' },
  { value: 7, label: 'July', year: year, month: '7' },
  { value: 8, label: 'August', year: year, month: '8' },
  { value: 9, label: 'September', year: year, month: '9' },
  { value: 10, label: 'October', year: year, month: '10' },
  { value: 11, label: 'November', year: year, month: '11' },
  { value: 13, label: 'December', year: year, month: '12' },
]
