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
  Divider,
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
import { usePasswordUpdateMutation } from 'api/user-account'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { Card } from 'components/card/card'

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
  const [currentPassword, setCurrentPassword] = useState(false)
  const [newPassword, setNewPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(false)
  const toast = useToast()
  const { t } = useTranslation()

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

  const handleClick = () => setCurrentPassword(!currentPassword)

  const handleClickSecond = () => setNewPassword(!newPassword)

  const handleClickThird = () => setConfirmPassword(!confirmPassword)

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
    <Card py="0">
      <form onSubmit={handleSubmit(onsubmit)}>
        <Stack mt="40px" ml="20px" boxSizing="border-box" h="68vh" overflow="auto">
          <Flex align="center" mb={14}>
            <Text mr={2} fontSize="18px" fontWeight={500} color="gray.600" fontStyle="normal">
              {t('password')}
            </Text>
            <Divider border="1px solid #E2E8F0" />
          </Flex>
          <VStack spacing={7} h="35vh" align="start">
            <FormControl isInvalid={!!errors.currentPassword} w="215px">
              <FormLabel sx={textStyle}>{t('currentPassword')}</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={currentPassword ? 'text' : 'password'}
                  sx={inputFieldStyle}
                  id="currentPassword"
                  {...register('currentPassword')}
                  variant="required-field"
                />
                <InputRightElement h="40px">
                  <Icon
                    as={currentPassword ? BsEyeSlash : BsEye}
                    onClick={handleClick}
                    fontSize="13px"
                    color="gray.600"
                    _hover={{ color: 'black' }}
                  />
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>{errors.currentPassword && errors.currentPassword.message}</FormErrorMessage>
            </FormControl>

            <HStack pb="8" spacing={4}>
              <FormControl isInvalid={!!errors.newPassword} w="215px" h="60px">
                <FormLabel sx={textStyle}>{t('newPassword')}</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={newPassword ? 'text' : 'password'}
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
                      as={newPassword ? BsEyeSlash : BsEye}
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
                <FormLabel sx={textStyle}>{t('newPasswordConfirmation')}</FormLabel>

                <InputGroup size="lg">
                  <Input
                    type={confirmPassword ? 'text' : 'password'}
                    sx={inputFieldStyle}
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    variant="required-field"
                  />
                  <InputRightElement h="40px">
                    <Icon
                      as={confirmPassword ? BsEyeSlash : BsEye}
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
                {t('passwordStrength')}
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
        </Stack>

        <Flex w="100%" h="90px" alignItems="center" justifyContent="end" borderTop="2px solid #E2E8F0">
          <Button colorScheme="brand" type="submit">
            {t('save')}
          </Button>
        </Flex>
      </form>
    </Card>
  )
}

export default VendorProfilePassword
