import { useState } from 'react'
import { Box, Checkbox, Flex, Center, Text, Button } from '@chakra-ui/react'
import React from 'react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { Controller } from 'react-hook-form'

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
}

export const Market = React.forwardRef((props: clientDetailProps) => {
  const market = props?.clientDetails?.markets
    ? props?.clientDetails?.markets?.map(market => ({
        label: market?.metropolitanServiceArea,
        value: market?.id,
      }))
    : null

    const btnStyle = {
      alignItems: 'center',
      justifyContent: 'end',
      borderTop: '1px solid #CBD5E0',
    }

  return (
    <>
      <Box h="400px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
          {market?.map(m => {
            return <CheckboxButton>{m?.label}</CheckboxButton>
          })}
        </Flex>
      </Box>
      <Flex style={ btnStyle } py={4} pt={5}>
        <Button colorScheme="brand" onClick={props?.onClose}>
          Cancel
        </Button>
      </Flex>
    </>
  )
})
