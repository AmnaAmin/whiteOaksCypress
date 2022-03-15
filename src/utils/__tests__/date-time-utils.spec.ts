import { dateFormat } from 'utils/date-time-utils'

describe('Date Time Util Test Cases', () => {
  test('Time format', () => {
    expect(dateFormat(new Date('12/03/2022'))).toEqual('12/03/2022')
  })
})
