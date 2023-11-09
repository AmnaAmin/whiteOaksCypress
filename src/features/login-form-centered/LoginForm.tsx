import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Icon,
  Divider,
  Text,
  Alert,
  AlertDescription,
  useDisclosure,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { PasswordField } from './PasswordField'
import { BiUserCheck } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import { DisclaimerModal } from 'components/LoginDisclaimer'
import { useAuth } from 'utils/auth-context'
import { signAgreementClient, SignatureDocument } from 'api/sign-agreement'
import { getToken } from 'utils/storage.utils'


type FormValues = {
  email: string
  password: string
}

type FormProps = {
  onSubmitForm: (val: FormValues) => void
  isError: boolean
  showDisclaimerModal?: boolean
}

export const LoginForm = (props: FormProps) => {
  const auth = useAuth()
  const token = getToken();
  const toast = useToast();
  //eslint-disable-next-line
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    trigger,
  } = useForm<FormValues>()
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: props.showDisclaimerModal })
  const watchEmail = watch('email')
  const watchPassword = watch('password')


  const signAgreement = async (data: SignatureDocument) => {
    if (token && token != null) {
      signAgreementClient(data, token).then(() => {
        navigate(0);
      }).catch((error: any) => {
        toast.closeAll();
        toast({
          title: `${error.response?.data?.title}: ${error.response?.data?.detail}`,
          position: 'top-left',
          status: 'error',
        });
        if (auth && auth.logout) {
          auth.logout();
        }
      });
    }
  }

  return (
    <chakra.form id="loginForm" {...props} data-testid="loginForm">
      <Stack spacing="29px" mx={{ sm: '70px' }} pt="20px">
        {props.isError && (
          <Alert status="error" bg="#fd397a" border="1px solid #fd397a" data-testid="alertError">
            <AlertDescription color="#fff">
              <strong>Failed to sign in!</strong> Please check your credentials and try again.
            </AlertDescription>
          </Alert>
        )}
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
          <FormErrorMessage>{errors.email && errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl id="password" isInvalid={!!errors?.password?.message}>
          <PasswordField {...register('password', { required: 'This is required field.' })} />
          <FormErrorMessage>{errors.password && errors.password?.message}</FormErrorMessage>
          <Text mt="5px" color="#345587" fontWeight="400" fontSize="12px">
            <Link to="/account/reset/" data-testid="forgotPasswordLink">
              Forgot Password?
            </Link>
          </Text>
        </FormControl>
        <Button
          _hover={{ bg: 'blue.700' }}
          bg="#345587"
          size="md"
          fontSize="14px"
          fontWeight="600"
          color="#FFFFFF"
          rounded="8px"
          data-testid="signInButton"
          onClick={function () {
            if (!!watchPassword && !!watchEmail) {
              handleSubmit((values) => {
                props.onSubmitForm(values);
                if (props.showDisclaimerModal) {
                  onOpen();
                }
              })();
            }
            else trigger()
          }}
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
      <DisclaimerModal
        data-testid='disclaimer-modal'
        isOpen={isOpen}
        onClose={() => {
          if (auth && auth.logout) {
            auth.logout();
          }
          onClose()
        }}
        onConfirm={(data: SignatureDocument) => signAgreement(data)}
      />
    </chakra.form>
  )
}
