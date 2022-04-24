import { VStack } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/react'

export default {
  title: 'Form/Input',
  component: Input,
}

export const InputSizes = () => {
  return (
    <VStack>
      <Input w="215px" variant="outline" size="sm" placeholder="Input size small" />
      <Input w="215px" variant="outline" size="md" placeholder="Input size medium" />
      <Input w="215px" variant="outline" size="lg" placeholder="Input size large" />
    </VStack>
  )
}

export const InputWithBorderLeft = () => {
  return (
    <VStack>
      <Input w="215px" variant="outline-with-left-border" size="sm" placeholder="Input size small" />
      <Input w="215px" variant="outline-with-left-border" size="md" placeholder="Input size medium" />
      <Input w="215px" variant="outline-with-left-border" size="lg" placeholder="Input size large" />
      <Input w="215px" variant="outline-with-left-border" size="sm" placeholder="with border color" isInvalid />
    </VStack>
  )
}
