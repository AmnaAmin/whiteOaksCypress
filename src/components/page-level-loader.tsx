import { Box, BoxProps, FormLabel, Spinner, VStack } from '@chakra-ui/react'

export const ViewLoader: React.FC<BoxProps & { label?: String | null }> = props => {
  const { label } = props
  return (
    <Box
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      aria-label="loading"
      zIndex="2"
    >
      <Box w="100%" h="100%" top="0" left="0" right="0" bottom="0" pos="absolute" bg="gray.200" opacity="0.4" />
      <VStack position="absolute">
        <Spinner thickness="4px" speed="0.65s" size="xl" zIndex="2" />
        {label && (
          <FormLabel variant={'light-label'} color="brand.300">
            {label}
          </FormLabel>
        )}
      </VStack>
    </Box>
  )
}
