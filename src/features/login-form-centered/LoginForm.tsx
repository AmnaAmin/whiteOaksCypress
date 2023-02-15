import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  HTMLChakraProps,
  Input,
  Stack,
  VStack,
  Icon,
  Divider,
  Text,
  Alert,
  AlertDescription
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useLogin } from 'utils/auth-context'
import { PasswordField } from './PasswordField'
import { BiUserCheck } from 'react-icons/bi'
import { Link } from 'react-router-dom'

type FormValues = {
  email: string
  password: string
}

type FormProps =  {
  onSubmitForm: (val: FormValues) => void
  isError: boolean
}
export const LoginForm = ( props: FormProps ) => {
  
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>()

  

  return (
    <chakra.form onSubmit={handleSubmit(props.onSubmitForm)} {...props} data-testid="loginForm">
      <Stack spacing="29px" mx={{ sm: '70px' }} pt="20px">
        {props.isError && 
          <Alert status="error" bg="#fd397a" border="1px solid #fd397a" data-testid="alertError">
            <AlertDescription color="#fff">
            <strong>Failed to sign in!</strong> Please check your credentials and try again.
            </AlertDescription>
          </Alert>
        }
        <FormControl id="email" isInvalid={!!errors?.email?.message}>
          <FormLabel fontSize="12px" fontWeight="700" color="#252F40">
            Username
          </FormLabel>
          <Input
            placeholder="Username"
            border="none"
            type="email"
            autoComplete="email"
            {...register('email', { required: 'This required field' })}
            bg="#FFFFFF"
            outline="1px solid #D9D9D9"
            data-testid="email"
          />
        </FormControl>
        <VStack pb="20px" alignItems="start" spacing="14px">
          <PasswordField {...register('password', { required: 'This is required field.' })} />
          <Text color="#345587" fontWeight="400" fontSize="12px">
            <Link to="/account/reset/" data-testid="forgotPasswordLink">Forgot Password?</Link>
          </Text>
        </VStack>
        <Button
          type="submit"
          _hover={{ bg: 'blue.700' }}
          bg="#345587"
          size="md"
          fontSize="14px"
          fontWeight="600"
          color="#FFFFFF"
          rounded="8px"
          data-testid="signInButton"
        >
          SIGN IN
        </Button>

        <Divider
          sx={{
            '@media (min-width: 800px)': {
              position: 'relative',
              left: '-13.5%',
              width: '130%',
            },
          }}
        />
        <Button
          _hover={{ bg: '#345587', color: '#fff' }}
          bg="#fff"
          size="md"
          fontSize="14px"
          fontWeight="500"
          color="#345587"
          rounded="8px"
          border={'1px solid #345587'}
          onClick={() => {
            window.location.href = 'vendor/register'
          }}
          data-testid="registerBtn"
        >
          <Icon as={BiUserCheck} w="32px" h="26px" mr="19px" /> Register As a Vendor
        </Button>
      </Stack>
    </chakra.form>
  )
}
