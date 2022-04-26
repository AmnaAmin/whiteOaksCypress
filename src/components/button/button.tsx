import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react'

export const Button: React.FC<ButtonProps> = props => {
  return (
    <ChakraButton _focus={{ outline: 'none' }} ml="3" {...props}>
      {props.children}
    </ChakraButton>
  )
}
