import {
    Button,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HTMLChakraProps,
    Input,
    Stack,
  } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useResetPasswordSendEmail, useResetPassword } from "api/reset-password";
import { useLocation } from "react-router-dom";
import PasswordStrengthBar, { measureStrength } from 'components/vendor-register/password-strength-bar'
import { PasswordField } from 'features/login-form-centered/PasswordField';

type FormValues = {
    email: string
    password: string
}
  
export const ResetPasswordForm = (props: HTMLChakraProps<'form'>) => {
    
    const { mutate: sendResetPasswordEmail } = useResetPasswordSendEmail();
    const { mutate: resetPassword } = useResetPassword();
    const params = new URLSearchParams( useLocation().search );
    
    const {
      handleSubmit,
      register,
      formState: { errors },
      watch
    } = useForm<FormValues>()

    const watchPassword = watch("password");
  
    const onSubmit = (values: FormValues) => {

        if ( params.get("key") ) {

            const key = params.get("key") as string;
            const password = values.password;

            resetPassword( { key: key, newPassword: password } )

        } else {
            sendResetPasswordEmail( values.email )
        }
        
    }
  
    return (
      <chakra.form onSubmit={handleSubmit(onSubmit)} {...props}>
        <Stack spacing="29px" mx={{ sm: '70px' }} pt="20px">
          { ! params.get("key") && ( <FormControl id="email" isInvalid={!!errors?.email?.message}>
            <FormLabel fontSize="12px" fontWeight="700" color="#252F40">
              Email
            </FormLabel>
            <Input
              placeholder="Email"
              border="none"
              type="email"
              autoComplete="email"
              {...register('email', { required: 'This is required field' })}
              bg="#FFFFFF"
              outline="1px solid #D9D9D9"
            />
          </FormControl> ) }

          { params.get("key") && ( <FormControl id="password" isInvalid={!!errors?.password}>
            <PasswordField 
            {...register('password', 
                { 
                    required: 'This is required field.', 
                    validate: ( pwd: string ) => {
                        return measureStrength(pwd)[1] >= 4;
                    }
                 },
            )}
            />
            <PasswordStrengthBar password={watchPassword} />
            <FormErrorMessage>{errors?.password && errors?.password?.type === "validate" && "Password must contain a lower, upper, symbol and a special character"}</FormErrorMessage>
          </FormControl> ) }
          
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
            Submit
          </Button>

          
        </Stack>
      </chakra.form>
    )
  }
  