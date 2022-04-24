import React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export const Card: React.FC<BoxProps> = props => {
  return (
    <Box
      bg="white"
      p="15px"
      boxShadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      h={props.height || 'auto'}
      rounded="xl"
      border="1px solid #E5E5E5"
      {...props}
    >
      {props.children}
    </Box>
  )
}
