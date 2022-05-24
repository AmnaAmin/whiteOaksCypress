import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Input,
  HStack,
  Progress,
  VStack,
  FormErrorMessage,
  SimpleGrid,
  InputRightElement,
  InputGroup,
  useToast,
  Flex,
  Icon,
} from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
// import { InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import zxcvbn from 'zxcvbn'
import { yupResolver } from '@hookform/resolvers/yup'

import { PasswordFormValues } from 'types/account.types'
import { successMessage } from 'utils/api-messages'
import { PasswordFormValidationSchema } from 'utils/form-validation'
import { usePasswordUpdateMutation } from 'utils/user-account'
import { t } from 'i18next'
import { Button } from 'components/button/button'

const textStyle = {
  color: '#4A5568',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '24px',
  whiteSpace: 'noWrap',
}

const inputFieldStyle = {
  backgroundColor: ' #FFFFFF',
  height: '40px',
}

const VendorProfilePassword = () => {
  const { mutate: updatePassword } = usePasswordUpdateMutation()
  const [show, setShow] = useState(false)
  const [showSecondField, setShowSecondField] = useState(false)
  const [showThirdField, setShowThirdField] = useState(false)
  const toast = useToast()

  const [strength, setStrength] = useState(0)
  const { type, colorScheme } = useMemo(() => {
    if (strength === 0) {
      return {
        type: 'empty',
        colorScheme: 'lightgray',
      }
    } else if (strength <= 1 && strength > 0) {
      return {
        type: 'weak',
        colorScheme: 'strengthColor',
      }
    } else if (strength > 2 && strength <= 3) {
      return {
        type: 'average',
        colorScheme: 'orange',
      }
    }

    return {
      type: 'strong',
      colorScheme: 'green',
    }
  }, [strength])

  const handleClick = () => setShow(!show)

  const handleClickSecond = () => setShowSecondField(!showSecondField)

  const handleClickThird = () => setShowThirdField(!showThirdField)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(PasswordFormValidationSchema),
  })

  const onsubmit = ({ newPassword, currentPassword }: PasswordFormValues) => {
    const payload = { newPassword, currentPassword }

    updatePassword(payload, {
      onSuccess() {
        const message = successMessage('Change Password', 'Password has been updated successfully')
        toast(message)
      },
    })
    reset()
  }

  return (
    <Stack mt="40px" ml="20px" boxSizing="border-box">
      <Text fontSize="18px" lineHeight="28px" fontWeight={500} fontStyle="normal" mb="20px" color="gray.600">
        {/* Password for [vendor@devtek.ai] */}
        Password
      </Text>

      <form onSubmit={handleSubmit(onsubmit)}>
        <VStack spacing={7} h="35vh" align="start">
          <FormControl isInvalid={!!errors.currentPassword} w="215px">
            <FormLabel sx={textStyle}>Current Password</FormLabel>

            <InputGroup size="lg">
              <Input
                type={show ? 'text' : 'password'}
                sx={inputFieldStyle}
                id="currentPassword"
                {...register('currentPassword')}
                rounded="6px"
                borderLeft="2px solid #4E87F8"
              />
              <InputRightElement h="40px">
                <Icon
                  as={show ? BsEyeSlash : BsEye}
                  onClick={handleClick}
                  fontSize="13px"
                  color="gray.600"
                  _hover={{ color: 'black' }}
                />
              </InputRightElement>
            </InputGroup>

            <FormErrorMessage>{errors.currentPassword && errors.currentPassword.message}</FormErrorMessage>
          </FormControl>

          <HStack pb="8">
            <FormControl isInvalid={!!errors.newPassword} w="215px" h="60px">
              <FormLabel sx={textStyle}>New Password</FormLabel>

              <InputGroup size="lg">
                <Input
                  type={showSecondField ? 'text' : 'password'}
                  sx={inputFieldStyle}
                  id="newPassword"
                  {...register('newPassword')}
                  rounded="6px"
                  onInput={event => {
                    const value = event.currentTarget.value
                    let score = zxcvbn(value).score

                    if (score === 0 && value !== '') {
                      score = 1
                    }

                    setStrength(score)
                  }}
                />
                <InputRightElement h="40px">
                  <Icon
                    as={showSecondField ? BsEyeSlash : BsEye}
                    onClick={handleClickSecond}
                    fontSize="13px"
                    color="gray.600"
                    _hover={{ color: 'black' }}
                  />
                </InputRightElement>
              </InputGroup>
              <Box>
                <FormErrorMessage>{errors.newPassword && errors.newPassword.message}</FormErrorMessage>
              </Box>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword} w="215px" h="60px">
              <FormLabel sx={textStyle}>New password confirmation</FormLabel>

              <InputGroup size="lg">
                <Input
                  type={showThirdField ? 'text' : 'password'}
                  sx={inputFieldStyle}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  rounded="6px"
                  borderLeft="2px solid #4E87F8"
                />
                <InputRightElement h="40px">
                  <Icon
                    as={showThirdField ? BsEyeSlash : BsEye}
                    onClick={handleClickThird}
                    fontSize="13px"
                    color="gray.600"
                    _hover={{ color: 'black' }}
                  />
                </InputRightElement>
              </InputGroup>
              <Box>
                <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
              </Box>
            </FormControl>
          </HStack>

          <FormControl height={29}>
            <FormLabel fontStyle="normal" fontSize="10px" fontWeight={400} lineHeight="15px" color="#374151">
              Password Strength
            </FormLabel>

            <SimpleGrid columns={3} row={1} gap={5} w="215px">
              <Progress
                colorScheme={colorScheme}
                w="71px"
                h="4px"
                bg="#E2E8F0"
                rounded="4px"
                value={type === 'empty' ? 0 : 100}
              />
              <Progress
                colorScheme={colorScheme}
                w="71px"
                h="4px"
                bg="#E2E8F0"
                rounded="4px"
                value={type === 'weak' || type === 'empty' ? 0 : 100}
              />
              <Progress
                colorScheme={colorScheme}
                w="71px"
                h="4px"
                bg="#E2E8F0"
                rounded="4px"
                value={type === 'empty' || type === 'weak' || type === 'average' ? 0 : 100}
              />
            </SimpleGrid>
          </FormControl>
        </VStack>

        <Flex w="100%" h="100px" alignItems="center" justifyContent="end" borderTop="2px solid #E2E8F0" mt="100px">
          <Button colorScheme="brand" type="submit">
            {t('save')}
          </Button>
        </Flex>
      </form>
    </Stack>
  )
}

export default VendorProfilePassword
