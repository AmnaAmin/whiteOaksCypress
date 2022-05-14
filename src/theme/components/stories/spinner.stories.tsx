import { Spinner } from '@chakra-ui/spinner'
import { Box } from '@chakra-ui/react'

export default {
  title: 'UI/Spinner',
  component: Spinner,
}

export const SpinnerDefault = () => {
  return (
    <Box
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      aria-label="loading"
      zIndex="1"
    >
      <Box w="100%" h="100%" top="0" left="0" right="0" bottom="0" pos="absolute" bg="gray.200" opacity="0.4" />
      <Spinner thickness="4px" speed="0.65s" size="xl" zIndex="2" position="absolute" />
    </Box>
  )
}
