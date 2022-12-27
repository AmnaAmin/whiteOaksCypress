import * as React from 'react'
import { Box, BoxProps, useColorModeValue as mode } from '@chakra-ui/react'

export const Sidebar: React.FC<BoxProps> = props => {
  return (
    <Box
      maxHeight="calc(100vh - 120px)"
      mt="12px"
      pb="2"
      isTruncated
      lineHeight="taller"
      {...props}
      sx={{
        '--sidebar-width': '12rem',

        '&::-webkit-scrollbar-track': {
          bg: 'transparent',
        },
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          bg: mode('blue.600', 'gray.700'),
          borderRadius: '20px',
        },
      }}
      style={{
        overflowY: 'auto',
      }}
    />
  )
}
