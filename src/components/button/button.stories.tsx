import { Button } from './button'

export default {
  title: 'UI/Button',
  component: Button,
}

export const Primary = () => (
  <Button variant="solid" colorScheme="blue">
    Primary
  </Button>
)

export const Secondary = () => (
  <Button variant="outline" colorScheme="blue">
    Secondary
  </Button>
)

export const Error = () => (
  <Button variant="solid" colorScheme="red">
    Secondary
  </Button>
)
