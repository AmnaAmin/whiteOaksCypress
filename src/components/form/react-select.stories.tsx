import { VStack, Box } from '@chakra-ui/layout'
import ReactSelect from './react-select'

export default {
  title: 'Form/React Select',
  component: ReactSelect,
}
const OPTIONS = [
  {
    value: '1',
    label: 'Pakistan',
  },
  {
    value: '2',
    label: 'United State of America',
  },
  {
    value: '3',
    label: 'United Kingdom',
  },
]

export const SelectSizes = () => (
  <VStack>
    <Box w="215px">
      <ReactSelect size="sm" options={OPTIONS} />
    </Box>
    <Box w="215px">
      <ReactSelect size="md" options={OPTIONS} />
    </Box>
    <Box w="215px">
      <ReactSelect size="lg" options={OPTIONS} />
    </Box>
  </VStack>
)

export const SelectStates = () => (
  <VStack>
    <Box w="215px">
      <ReactSelect options={OPTIONS} isDisabled />
    </Box>
    <Box w="215px">
      <ReactSelect selectProps={{ isBorderLeft: true }} options={OPTIONS} />
    </Box>
    <Box w="215px">
      <ReactSelect size="lg" errorBorderColor="red.500" isInvalid options={OPTIONS} />
    </Box>
  </VStack>
)

export const ShowMenu = () => (
  <VStack gap="50px">
    <Box w="215px">
      <ReactSelect options={OPTIONS} defaultMenuIsOpen value={OPTIONS[1]} />
    </Box>
  </VStack>
)
