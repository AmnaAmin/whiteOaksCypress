import { Box } from '@chakra-ui/react'
import * as React from 'react'
import { CookieBanner } from './CookieBanner'

export const App = () => (
  <Box as="section" minH="2xs">
    <CookieBanner position="absolute" bottom="0" right="0" left="0" />
  </Box>
)
