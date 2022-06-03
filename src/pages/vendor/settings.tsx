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
} from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { SettingsValues } from 'types/vendor.types'
import last from 'lodash/last'
import {
  readFileContent,
  useSaveSettings,
  //  languageOptions,
  useAccountDetails,
} from 'utils/vendor-details'
// import { FormSelect } from 'components/react-hook-form-fields/select'
import { FormInput } from 'components/react-hook-form-fields/input'
// import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { useTranslation } from 'react-i18next'
import { BiUser } from 'react-icons/bi'
import { MdCameraAlt } from 'react-icons/md'
import { Button } from 'components/button/button'
import { convertImageUrltoDataURL, dataURLtoFile } from 'components/table/util'
import { Card } from 'components/card/card'

const Settings = React.forwardRef((props, ref) => {
  const { mutate: saveSettings } = useSaveSettings()
  const { data: account, refetch } = useAccountDetails()
  const [preview, setPreview] = useState<string | null>(null)
  const [imgFile, setImgFile] = useState<any>(null)

  const { i18n, t } = useTranslation()

  const settingsDefaultValue = account => {
    const settings = {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.login,
      language: account.langKey,
      profilePicture: account.imageUrl,
    }
    return settings
  }

  useEffect(() => {
    refetch()
    const element = document.getElementById('Avatar')
    element?.classList.add('form-file-input')
  }, [refetch])

  const {
    register,
    formState: { errors },
    handleSubmit,
    // control,
    watch,
    reset,
  } = useForm<SettingsValues>()

  useEffect(() => {
    if (account) {
      const defaultSettings = settingsDefaultValue(account)
      setPreview(account.imageUrl)
      if (account.imageUrl) {
        convertImageUrltoDataURL(account.imageUrl).then(dataUrl => {
          var fileData = dataURLtoFile(dataUrl, last(account.imageUrl.split('/')))
          setImgFile(fileData)
        })
      }
      reset(defaultSettings)
    }
  }, [account, reset])

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

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
      }
      saveSettings(settingsPayload)
      // setTimeout(() => {
      //   refetch()
      // }, 2000) // call for refetch because we are getting no response from current api. Needs to change when correct response is receieved
      // setLanguage(values.language);
      i18n.changeLanguage(values.language)
      console.log('preview', settingsPayload)
    },
    [i18n, refetch, saveSettings, imgFile],
  )

  return (
    <Card py="0">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt="40px" ml="20px" h="68vh" overflow="auto">
          <Flex align="center" mb={12}>
            <Text mr={2} fontSize="18px" fontWeight={500} color="gray.600" fontStyle="normal">
              {t('settings')}
            </Text>
            <Divider border="1px solid #E2E8F0" />
          </Flex>

          <Stack mb="10">
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

          <Stack w="215px" mb={9}>
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

          <HStack spacing={4}>
            <FormInput
              errorMessage={errors.firstName && errors.firstName?.message}
              label={t('firstName')}
              placeholder={t('firstName')}
              register={register}
              controlStyle={{ w: '215px' }}
              elementStyle={{
                bg: 'white',
                borderLeft: '2px solid #4E87F8',
              }}
              rules={{ required: 'This is required field' }}
              name={`firstName`}
            />
            <FormInput
              errorMessage={errors.lastName && errors.lastName?.message}
              label={t('lastName')}
              placeholder={t('lastName')}
              register={register}
              controlStyle={{ w: '215px' }}
              elementStyle={{ bg: 'white' }}
              rules={{ required: 'This is required field' }}
              name={`lastName`}
            />
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
    <Box>
      <Box pos="relative" display="flex" justifyContent="center" alignContent="center">
        <Avatar size="lg" src={preview || defaultImage} zIndex={1}></Avatar>
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
  )
}

export default Settings
