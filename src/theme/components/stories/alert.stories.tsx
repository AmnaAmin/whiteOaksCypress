import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/alert'
import { CloseButton } from '@chakra-ui/react'

export default {
  title: 'UI/Alert',
  component: Alert,
}

export const AlertInfo = () => {
  return (
    <Alert status="info" variant="custom" size="sm">
      <AlertIcon />
      <AlertDescription>Info status alert</AlertDescription>
      <CloseButton alignSelf="flex-start" position="absolute" right={2} top={2} size="sm" />
    </Alert>
  )
}
