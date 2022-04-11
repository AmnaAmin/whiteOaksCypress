import React from 'react'
import { Box, Divider, Heading, HStack, Stack, Text } from '@chakra-ui/react'

interface InputViewProps {
  label: string
  Icon?: JSX.Element
  InputElem?: JSX.Element
  showDivider?: boolean
  controlStyle?: any
}

const InputView = ({ label, Icon, InputElem, showDivider = true, controlStyle = {} }: InputViewProps) => {
  return (
    <Box {...controlStyle} whiteSpace="nowrap">
      <HStack align="flex-start" spacing={5}>
        {Icon && (
          <Box fontSize="1.5rem" color="#718096" pos="relative" bottom="5px">
            {Icon}
          </Box>
        )}
        <Stack>
          <Heading color="gray.600" fontSize="14px" fontWeight={500}>
            {label}
          </Heading>
          <Text minH="22px" fontSize="14px" fontStyle="normal" fontWeight={400} color="gray.500">
            {InputElem}
          </Text>
        </Stack>
      </HStack>
      {showDivider && <Divider orientation="horizontal" pt={5} mb={5} w="284px" />}
    </Box>
  )
}

export default InputView
