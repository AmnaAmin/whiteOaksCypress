import React, { useState } from 'react'
import { CalendarIcon } from '@chakra-ui/icons'
import ReactDatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import InputView from '../input-view/input-view'
import { Box } from '@chakra-ui/react'

const DatePicker = ({ date, disabled = false, label }) => {
  const [selectedDate, setSelectedDate] = useState(date)
  return (
    <div>
      <InputView
        label={label}
        Icon={CalendarIcon}
        InputElem={
          selectedDate ? (
            <ReactDatePicker
              disabled={disabled}
              selected={new Date(selectedDate)}
              onChange={date => setSelectedDate(date)}
            />
          ) : (
            <Box h="25">null</Box>
          )
        }
      />
    </div>
  )
}

export default DatePicker
