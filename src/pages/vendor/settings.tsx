import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Box,
  HStack,
  Avatar,
  Text,
  Stack,
  Divider,
  Icon,
  VStack,
  Input,
  Flex,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import { SettingsValues } from 'types/vendor.types'
import last from 'lodash/last'
import { readFileContent, useSaveSettings, useAccountDetails } from 'api/vendor-details'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useTranslation } from 'react-i18next'
import { BiUser } from 'react-icons/bi'
import { MdCameraAlt } from 'react-icons/md'
import { Button } from 'components/button/button'
import { convertImageUrltoDataURL, dataURLtoFile } from 'components/table/util'
import { Card } from 'components/card/card'
import { useAuth } from 'utils/auth-context'
import NumberFormat from 'react-number-format'
import { CustomRequiredInput } from 'components/input/input'
import ReactSelect from 'components/form/react-select'
import { useStates } from 'api/pc-projects'

const validateTelePhoneNumber = (number: string): boolean => {
  return number ? number.match(/\d/g)?.length === 10 : false
}

const Settings = React.forwardRef(() => {
  const { mutate: saveSettings, isSuccess } = useSaveSettings()
  const { updateAccount } = useAuth()

  const { data: account, refetch } = useAccountDetails()
  const [preview, setPreview] = useState<string | null>(null)
  const [imgFile, setImgFile] = useState<any>(null)

  const { i18n, t } = useTranslation()
  const { stateSelectOptions: stateOptions } = useStates()

  const settingsDefaultValue = account => {
    const settings = {
      firstName: account.firstName,
      lastName: account.lastName,
      address: account.streetAddress,
      city: account.city,
      state: {
        id: account.stateId,
        value: stateOptions[account.stateId - 1]?.value,
        label: stateOptions[account.stateId - 1]?.label,
      },
      zipCode: account.zipCode,
      phoneNo: account.telephoneNumber,
      email: account.login,
      language: account.langKey,
      profilePicture: account.imageUrl,
    }
    return settings
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
  } = useForm<SettingsValues>()

  useEffect(() => {
    if (!account) return
    setValue('state', {
      id: account.stateId,
      value: stateOptions[account.stateId - 1]?.value,
      label: stateOptions[account.stateId - 1]?.label,
    })
  }, [stateOptions, account])

  useEffect(() => {
    refetch()
    const element = document.getElementById('Avatar')
    element?.classList.add('form-file-input')
  }, [refetch])

  useEffect(() => {
    if (!isSuccess) return
    const values = getValues()

    updateAccount?.({
      ...account,
      email: values.email || '',
      firstName: values.firstName || '',
      lastName: values.lastName || '',
      imageUrl: preview,
      address: values.address || '',
      stateId: values.state.id || '',
      city: values.city || '',
      zipCode: values.zipCode || '',
      phoneNO: values.phoneNo || '',
    })
  }, [isSuccess, getValues])

  useEffect(() => {
    if (account) {
      const defaultSettings = settingsDefaultValue(account)
      setPreview(account.imageUrl)
      if (account.imageUrl) {
        convertImageUrltoDataURL(account.imageUrl)
          .then(dataUrl => {
            var fileData = dataURLtoFile(dataUrl, last(account.imageUrl.split('/')))
            setImgFile(fileData)
          })
          .catch(err => {
            console.error('error in convert Image Url to DataURL', err)
          })
      }
      reset(defaultSettings)
    }
  }, [account, reset])

  const onSubmit = useCallback(
    async values => {
      let fileContents: any = null
      if (imgFile) {
        fileContents = await readFileContent(imgFile)
      }
      const settingsPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        langKey: values.language,
        login: values.email,
        avatarName: imgFile?.type ?? null,
        avatar: fileContents,
        streetAddress: values.address,
        stateId: values.state.id,
        city: values.city,
        zipCode: values.zipCode,
        telephoneNumber: values.phoneNo,
      }
      saveSettings(settingsPayload)

      i18n.changeLanguage(values.language)
    },
    [i18n, saveSettings, imgFile],
  )

  return (
    <Card py="0">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt="30px" ml={{ base: 0, sm: '20px' }} h="68vh" overflow="auto">
          <Flex align="center" mb={7}>
            <Text mr={2} fontSize="18px" fontWeight={500} color="gray.600" fontStyle="normal">
              {t('settings')}
            </Text>
            <Divider border="1px solid #E2E8F0" />
          </Flex>

          <Stack mb="7">
            <Text fontSize="16px" fontWeight={500} color="gray.600" fontStyle="normal">
              {t('profilePicture')}
            </Text>
            <HStack spacing={4}>
              <PreviewImg preview={preview} onPreviewChange={setPreview} onImageFileChange={setImgFile} />
              <Text fontSize="14px" fontWeight={400} color="gray.600">
                {t('changePicture')}
              </Text>
            </HStack>
          </Stack>

          <Stack w="215px" mb="20px">
            <VStack alignItems="start">
              <Text fontSize="14px" fontWeight={500} color="gray.600">
                {t('email')}
              </Text>
              <InputGroup>
                <Input disabled value={account?.login} type="text" />

                <InputLeftElement className="InputLeft" pointerEvents="none" zIndex={1}>
                  <Box color="gray.400" fontSize="14px">
                    <BiUser size={20} cursor="pointer" color="#A0AEC0" />
                  </Box>
                </InputLeftElement>
              </InputGroup>
            </VStack>
          </Stack>

          <HStack spacing={{ base: 0, sm: 4 }} flexDir={{ base: 'column', sm: 'row' }} alignItems="start">
            <FormInput
              errorMessage={errors.firstName && errors.firstName?.message}
              label={t('firstName')}
              placeholder={t('firstName')}
              register={register}
              controlStyle={{ w: { base: '100%', sm: '215px' } }}
              variant="required-field"
              rules={{ required: 'This is required field' }}
              name={`firstName`}
            />
            <FormInput
              errorMessage={errors.lastName && errors.lastName?.message}
              label={t('lastName')}
              placeholder={t('lastName')}
              variant="required-field"
              register={register}
              controlStyle={{ w: { base: '100%', sm: '215px' } }}
              elementStyle={{ bg: 'white' }}
              rules={{ required: 'This is required field' }}
              name={`lastName`}
            />
          </HStack>
          <HStack spacing={{ base: 0, sm: 4 }} flexDir={{ base: 'column', sm: 'row' }} alignItems="start">
            <FormInput
              errorMessage={errors.address && errors.address?.message}
              label={t('address')}
              register={register}
              variant="required-field"
              controlStyle={{ w: { base: '100%', sm: '215px' } }}
              elementStyle={{ bg: 'white' }}
              rules={{ required: 'This is required field' }}
              name={`address`}
            />

            <FormInput
              errorMessage={errors.city && errors.city?.message}
              label={t('city')}
              register={register}
              controlStyle={{ w: { base: '100%', sm: '215px' } }}
              variant="required-field"
              rules={{ required: 'This is required field' }}
              name={`city`}
            />
          </HStack>
          <HStack spacing={{ base: 0, sm: 4 }} flexDir={{ base: 'column', sm: 'row' }} alignItems="start">
            {/* <FormInput
              errorMessage={errors.state && errors.state?.message}
              label={t('state')}
              register={register}
              controlStyle={{ w: { base: '100%', sm: '215px' } }}
              variant="required-field"
              rules={{ required: 'This is required field' }}
              name={`state`}
            /> */}
            <FormControl w={215}>
              <FormLabel variant="strong-label" size="md" h="21px">
                {t(`state`)}
              </FormLabel>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <ReactSelect   classNamePrefix={'settingsState'} id="state" {...field} options={stateOptions} selectProps={{ isBorderLeft: true }} />
                )}
              />
            </FormControl>
            <FormInput
              errorMessage={errors.zipCode && errors.zipCode?.message}
              label={t('zipCode')}
              register={register}
              controlStyle={{ w: { base: '100%', sm: '215px' } }}
              variant="required-field"
              elementStyle={{ bg: 'white' }}
              rules={{ required: 'This is required field' }}
              name={`zipCode`}
            />
          </HStack>
          <HStack spacing={4}>
            <FormControl isInvalid={!!errors.phoneNo} w={{ base: '100%', sm: '215px' }}>
              <FormLabel variant="strong-label" size="md" noOfLines={1} mb={'3px'}>
                {t('phoneNo')}
              </FormLabel>
              <Controller
                control={control}
                rules={{
                  required: 'This is required field',
                  validate: (number: string | undefined) => validateTelePhoneNumber(number!),
                }}
                name="phoneNo"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        value={field.value}
                        customInput={CustomRequiredInput}
                        format="(###)-###-####"
                        mask="_"
                        onValueChange={e => {
                          field.onChange(e.value)
                        }}
                      />

                      <FormErrorMessage>{fieldState.error && 'Valid Phone Number Is Required'}</FormErrorMessage>
                    </>
                  )
                }}
              ></Controller>
            </FormControl>
          </HStack>
        </Box>
        <Flex id="footer" w="100%" h="90px" alignItems="center" justifyContent="end" borderTop="2px solid #E2E8F0">
          <Button colorScheme="brand" type="submit">
            {t('save')}
          </Button>
        </Flex>
      </form>
    </Card>
  )
})

export const PreviewImg = ({ preview, onPreviewChange, onImageFileChange }) => {
  const defaultImage = 'https://bit.ly/sage-adebayo'

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputClick = e => {
    e.preventDefault()
    fileInputRef.current!.click()
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    onImageFileChange(file)
    const reader = new FileReader()
    reader.onloadend = () => onPreviewChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Box>
        <Box pos="relative" display="flex" justifyContent="center" alignContent="center">
          <Avatar
            _before={{
              content: `""`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'black',
              opacity: 0.2,
              borderRadius: '50%',
            }}
            size="lg"
            src={preview || defaultImage}
            zIndex={1}
          ></Avatar>
          <Button
            ml={0}
            onClick={handleInputClick}
            bg="transparent"
            variant="unstyled"
            pos="absolute"
            zIndex={2}
            top="17px"
            _focus={{ outline: 'none' }}
          >
            <Icon as={MdCameraAlt} boxSize={5} color="#FFFFFF" />
          </Button>
        </Box>
        <Input hidden type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
      </Box>
    </>
  )
}

export default Settings
