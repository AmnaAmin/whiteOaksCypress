import { Box, BoxProps, Container, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'
import { TabLink } from './TabLink'

export const PageHeader = (props: BoxProps) => (
  <Box bg={useColorModeValue('white', 'gray.900')} pt="8" shadow="sm" {...props}>
    <Container maxW="7xl">
      <Heading size="lg" mb="3">
        Forms
      </Heading>
      <Stack direction="row" spacing="4">
        <TabLink aria-current="page" href="#">
          Overview
        </TabLink>
        <TabLink href="#">Analytics</TabLink>
        <TabLink href="#">Automation</TabLink>
      </Stack>
    </Container>
  </Box>
)
