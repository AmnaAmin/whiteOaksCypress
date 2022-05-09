import { VStack } from '@chakra-ui/layout'
import { Textarea } from '@chakra-ui/react'

export default {
  title: 'Form/Textarea',
  component: Textarea,
}

export const TextAreaSizes = () => {
  return (
    <VStack>
      <Textarea w="215px" variant="outline" size="sm" placeholder="Input size small" />
      <Textarea w="215px" variant="outline" size="md" placeholder="Input size medium" />
      <Textarea w="215px" variant="outline" size="lg" placeholder="Input size large" />
    </VStack>
  )
}

export const TextAreaWithBorderLeft = () => {
  return (
    <VStack>
      <Textarea w="215px" variant="outline" size="sm" placeholder="Input size small" />
      <Textarea w="215px" variant="outline" size="md" placeholder="Input size medium" />
      <Textarea w="215px" variant="outline" size="lg" placeholder="Input size large" />
      <Textarea w="215px" variant="outline" size="sm" placeholder="with border color" isInvalid />
    </VStack>
  )
}
