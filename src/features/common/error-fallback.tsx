import { Center, Box, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react"

export const ErrorFallback = () => {
    return (
      <Center>
        <Box mt="60px">
          <Alert status="warning" bg="#fff">
            <AlertIcon />
            <AlertTitle>Something went wrong.</AlertTitle>
            <AlertDescription>Please contact your system admin.</AlertDescription>
          </Alert>
        </Box>
      </Center>
    )
  }