import { Checkbox } from '@chakra-ui/checkbox'
import { Stack } from '@chakra-ui/react'

export default {
  title: 'Form/Checkbox',
  component: Checkbox,
}

export const CheckboxSizes = () => {
  return (
    <Stack spacing={[1, 5]} direction={['column', 'row']}>
      <Checkbox size="sm" colorScheme="red">
        Checkbox
      </Checkbox>
      <Checkbox size="md" colorScheme="green" defaultChecked>
        Checkbox
      </Checkbox>
      <Checkbox size="lg" colorScheme="orange" defaultChecked>
        Checkbox
      </Checkbox>
    </Stack>
  )
}

export const CheckboxVariants = () => {
  return (
    <Stack spacing={[1, 5]} direction={['column', 'row']}>
      <Checkbox size="md" colorScheme="brand" defaultChecked variant="link">
        Link Variants
      </Checkbox>
    </Stack>
  )
}
