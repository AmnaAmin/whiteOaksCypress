import { Button, chakra, FormControl, FormLabel, HTMLChakraProps, Input, Stack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useAuth } from 'utils/auth-context'
import { PasswordField } from './PasswordField'

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
      <Stack spacing="6">
        <FormControl id="email" isInvalid={!!errors?.email?.message}>
          <FormLabel>Email address</FormLabel>
          <Input type="email" autoComplete="email" {...register('email', { required: 'This required field' })} />
        </FormControl>
        <PasswordField {...register('password', { required: 'This is required field.' })} />
        <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
          Sign in
        </Button>
      </Stack>
    </chakra.form>
  )
}
