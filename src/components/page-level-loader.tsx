import { Box, BoxProps, Spinner } from '@chakra-ui/react'

export const ViewLoader: React.FC<BoxProps> = props => {
  return (
    <Box
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      aria-label="loading"
      zIndex="1"
    >
      {/* <Box {...props} w="100%" h="100%" /> */}
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" zIndex="2" />
    </Box>
  )
}
