import { VStack, Button } from '@chakra-ui/react'

export default {
  title: 'UI/Button',
  component: Button,
}

export const ButtonSolid = () => (
  <VStack>
    <Button variant="solid" colorScheme="brand" size="xs">
      Solid
    </Button>
    <Button variant="solid" colorScheme="brand" size="sm">
      Solid
    </Button>
    <Button variant="solid" colorScheme="brand" size="md">
      Solid
    </Button>
    <Button variant="solid" colorScheme="brand" size="lg">
      Solid
    </Button>
  </VStack>
)

export const ButtonOutline = () => (
  <Button variant="outline" colorScheme="brand">
    Outline
  </Button>
)

export const Error = () => (
  <Button variant="solid" colorScheme="red" size="md">
    Secondary
  </Button>
)

export const Ghost = () => (
  <Button variant="ghost" colorScheme="brand">
    Secondary
  </Button>
)
