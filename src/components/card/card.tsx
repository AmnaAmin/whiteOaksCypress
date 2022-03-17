import React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export const Card: React.FC<BoxProps> = props => {
  return (
    <Box
      bg="white"
      p="15px"
      //  boxShadow="1px 1px 12px rgba(0,0,0,0.2)"
      boxShadow="1px 0px 70px rgb(0 0 0 / 10%)"
      h={props.height || 'auto'}
      {...props}
    >
      {props.children}
    </Box>
  )
}
