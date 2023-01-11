import { Box, Button, chakra, FormControl, FormLabel, HTMLChakraProps, Input, Stack, Text } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useAuth } from 'utils/auth-context'
import { PasswordField } from './PasswordField'
import { Link } from '@chakra-ui/react'

type FormValues = {
  email: string
  password: string
}

export const LoginForm = (props: HTMLChakraProps<'form'>) => {
  const { login } = useAuth()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = (values: FormValues) => {
    login?.(values)
  }

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)} {...props}>
      <Stack spacing="29px">
        <FormControl id="email" isInvalid={!!errors?.email?.message}>
          <FormLabel fontSize="12px" fontWeight="700" color="#252F40">
            Username
          </FormLabel>
          <Input
            placeholder="Username"
            type="email"
            autoComplete="email"
            {...register('email', { required: 'This required field' })}
            bg="#FFFFFF"
            border="1px solid #D9D9D9"
          />
        </FormControl>
        <PasswordField {...register('password', { required: 'This is required field.' })} />
        <Box color="#345587" fontWeight="400" fontSize="12px" pb="20px">
          Forgot Password?
        </Box>
        <Button
          type="submit"
          _hover={{ bg: 'blue.700' }}
          bg="#345587"
          size="md"
          fontSize="14px"
          fontWeight="700"
          color="#FFFFFF"
          rounded="8px"
        >
          SIGN IN
        </Button>
        <Text textAlign="center" fontSize={{ base: '16px', sm: '21px' }} fontWeight={500} color="#8392AB">
          <Link href="vendor/register">Register as a Vendor</Link>
        </Text>
      </Stack>
    </chakra.form>
  )
}
