import { Box, VStack, Text, Image } from '@chakra-ui/react'
import { Card } from 'features/login-form-centered/Card'
import { LoginForm } from 'features/login-form-centered/LoginForm'

export const Login = () => {
  return (
    <Box
      bgImg="url(./bg.svg)"
      bgRepeat="no-repeat"
      bgSize="cover"
      w="100wh"
      minH="100vh"
      py="12"
      px={{ base: '4', lg: '8' }}
      display="flex"
      dir="column"
      alignItems="center"
    >
      <Box width="100%" maxW="md" mx="auto">
        <Card
          borderBottomLeftRadius="0px !important"
          borderBottomRightRadius="0px !important"
          bg="#F2F2F2"
          py="20px !important"
        >
          <VStack spacing={{ base: '10px', sm: '14px' }}>
            <Box w={{ base: '101px', sm: '152px' }} h={{ base: '109px', sm: '164px' }}>
              <Image src="./blueLogo.png" />
            </Box>
            <Text fontWeight="400" fontSize={{ base: '15px', sm: '22px' }} color="#707070">
              Please login to your account
            </Text>
          </VStack>
        </Card>
        <Card borderTopRightRadius="0px !important" borderTopLeftRadius="0px !important" bg="#FFFFFF">
          <LoginForm />
        </Card>
        <Text textAlign="center" fontSize="14px" fontWeight="400px" color="#3A3A3A" mt="23px">
          © 2022-23 Harvest WhiteOaks. All Rights Reserved.
        </Text>
      </Box>
    </Box>
  )
}
