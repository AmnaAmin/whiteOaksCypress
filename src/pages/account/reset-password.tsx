import { Box, VStack, Text, Image } from '@chakra-ui/react'
import { Card } from 'features/login-form-centered/Card'
import { ResetPasswordForm } from "features/account/reset-password-form";

export const ResetPassword = () => {
  return (
    <Box
      bgImg="url(./bg.svg)"
      bgRepeat="no-repeat"
      bgSize="cover"
      w="100%"
      minH="100vh"
      py="12"
      px={{ base: '4', md: '8' }}
      display="flex"
      dir="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="584px" mx="auto">
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
              Reset your password
            </Text>
          </VStack>
        </Card>
        <Card borderTopRightRadius="0px !important" borderTopLeftRadius="0px !important" bg="#FFFFFF" pb="10">
          <ResetPasswordForm />
        </Card>
        <Text textAlign="center" fontSize="14px" fontWeight="400px" color="#3A3A3A" mt="23px">
          © 2022-23 Harvest WhiteOaks. All Rights Reserved.
        </Text>
      </Box>
    </Box>
  )
}
