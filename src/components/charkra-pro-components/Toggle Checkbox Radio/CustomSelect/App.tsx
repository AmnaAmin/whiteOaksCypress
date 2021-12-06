import { Box, chakra, ChakraProvider, HStack, Icon, Stack, Text } from '@chakra-ui/react'
import * as React from 'react'
import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi'
import { CustomSelect } from './CustomSelect'
import { Option } from './Option'
import { theme } from './theme'

/**
 * Please note - this component uses Downshift as a dependency. This must be installed additionally using `yarn add downshift`
 */
export const App = () => {
  const [colorMode, setColorMode] = React.useState<string | null | undefined>()

  return (
    <ChakraProvider theme={theme}>
      <Box
        maxW="xs"
        mx="auto"
        minH="xs"
        px={{ base: '4', md: '8', lg: '12' }}
        py={{ base: '6', md: '8', lg: '12' }}
      >
        <Stack>
          <Text>
            Color Mode: <chakra.span fontWeight="bold">{colorMode}</chakra.span>
          </Text>
          <CustomSelect
            name="ColorMode"
            colorScheme="blue"
            value={colorMode}
            onChange={setColorMode}
            placeholder="Select a color mode"
          >
            <Option value="light">
              <HStack>
                <Icon as={FiSun} />
                <Text>Light</Text>
              </HStack>
            </Option>
            <Option value="dark">
              <HStack>
                <Icon as={FiMoon} />
                <Text>Dark</Text>
              </HStack>
            </Option>
            <Option value="system">
              <HStack>
                <Icon as={FiMonitor} />
                <Text>System</Text>
              </HStack>
            </Option>
          </CustomSelect>
        </Stack>
      </Box>
    </ChakraProvider>
  )
}
