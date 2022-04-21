import { Button } from './button'

export default {
  title: 'UI/Button',
  component: Button,
}

export const Primary = () => (
  <Button variant="solid" colorScheme="brand" size="lg">
    Primary
  </Button>
)

export const Secondary = () => (
  <Button variant="outline" colorScheme="brand">
    Secondary
  </Button>
)

export const Error = () => (
  <Button variant="solid" colorScheme="red">
    Secondary
  </Button>
)

export const Ghost = () => (
  <Button variant="ghost" colorScheme="brand">
    Secondary
  </Button>
)
