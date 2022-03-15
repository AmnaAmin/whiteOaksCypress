import { Box, Spinner } from '@chakra-ui/react'

export const PageLoader = () => {
  return (
    <Box
      h="100vh"
      w="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      aria-label="loading"
    >
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  )
}
