import { VStack } from '@chakra-ui/layout'
import { FormLabel } from '@chakra-ui/react'

export default {
  title: 'Form/Label',
  component: FormLabel,
}

export const StrongLabels = () => {
  return (
    <VStack>
      <FormLabel variant="strong-label" size="sm">
        Solid Label small
      </FormLabel>
      <FormLabel variant="strong-label" size="md">
        Solid Label medium
      </FormLabel>
      <FormLabel variant="strong-label" size="lg">
        Solid Label Large
      </FormLabel>
    </VStack>
  )
}

export const LightLabels = () => {
  return (
    <VStack>
      <FormLabel variant="light-label" size="sm">
        Light Label small
      </FormLabel>
      <FormLabel variant="light-label" size="md">
        Light Label medium
      </FormLabel>
      <FormLabel variant="light-label" size="lg">
        Light Label large
      </FormLabel>
    </VStack>
  )
}
