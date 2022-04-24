import { VStack } from '@chakra-ui/layout'
import { Card } from './card'

export default {
  title: 'UI/Card',
  component: Card,
}

export const CardWithText = () => (
  <VStack alignItems="start" gap="1rem">
    <Card h="120px" w="lg">
      Card Text
    </Card>
    <Card h="120px" w="lg">
      Card Text
    </Card>
  </VStack>
)
