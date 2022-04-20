import { Button } from './button'

export default {
  title: 'UI/Button',
  component: Button,
}

export const Primary = () => (
  <Button variant="custom" colorScheme="blue">
    Primary
  </Button>
)

export const Secondary = () => (
  <Button variant="outline" colorScheme="blue">
    Secondary
  </Button>
)

export const Error = () => (
  <Button variant="custom" colorScheme="red">
    Secondary
  </Button>
)
