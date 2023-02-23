import moment from 'moment'
import { dateFormat } from 'utils/date-time-utils'

describe('Date Time Util Test Cases', () => {
  test('Time format using browser function', () => {
    expect(dateFormat(new Date('12/03/2022'))).toEqual('12/03/2022')
  })

  test('Time format using moment library', () => {
    expect(moment('12/03/2022').format('MM/DD/YYYY')).toEqual('12/03/2022')
  })
})
