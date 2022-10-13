import { Input } from '@chakra-ui/react'
import NumberFormat from 'react-number-format'

export const CustomRequiredInput = props => {
  return <Input {...props} variant="required-field" />
}

export const CustomInput = props => {
  return <Input {...props} variant="outline" />
}

export const NumberResInput = ({ ...rest }) => {
  // 9999999 for 7 digits condition
  return <NumberFormat isAllowed={({ value }) => Number(value) <= 9999999} {...rest} />
}
