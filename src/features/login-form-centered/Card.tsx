import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'

export const Card = (props: BoxProps) => (
  <Box
    boxShadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
    bg={useColorModeValue('white', 'gray.700')}
    py="8"
    px={{ base: '4', md: '10' }}
    shadow="base"
    rounded={{ base: 'lg' }}
    {...props}
  />
)
