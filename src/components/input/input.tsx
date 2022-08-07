import { Input } from '@chakra-ui/react'

export const CustomRequiredInput = props => {
  return <Input {...props} variant="required-field" />
}

export const CustomInput = props => {
  return <Input {...props} variant="outline" />
}
