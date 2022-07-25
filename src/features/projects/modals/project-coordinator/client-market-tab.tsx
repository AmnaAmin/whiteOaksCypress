import { useState } from 'react'
import { Box, Checkbox, Flex, Center, Text, Button } from '@chakra-ui/react'
import React from 'react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { Controller } from 'react-hook-form'

type clientDetailProps = {
  clientDetails?: any
}

export const Market = React.forwardRef((props: clientDetailProps) => {
  const market = props?.clientDetails?.markets
    ? props?.clientDetails?.markets?.map(market => ({
        label: market?.metropolitanServiceArea,
        value: market?.id,
      }))
    : null

  return (
    <Box h="502px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
          {market?.map((m) => {
            return (
              <CheckboxButton>{m?.label}</CheckboxButton>
            )
          })}
        </Flex>
      </Box>
  )
})
