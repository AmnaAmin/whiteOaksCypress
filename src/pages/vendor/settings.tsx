import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Box, HStack, Avatar, Text, Stack, Divider, Icon, VStack, Input, Flex } from '@chakra-ui/react'

import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { SettingsValues } from 'types/vendor.types'
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
import { BiBriefcase } from 'react-icons/bi'
import { MdCameraAlt } from 'react-icons/md'
import { Button } from 'components/button/button'

const Settings = React.forwardRef((props, ref) => {
  const { mutate: saveSettings } = useSaveSettings()
  const { data: account, refetch } = useAccountDetails()
  // const [lang, setLanguage] = useState(account?.langKey);
  const { i18n, t } = useTranslation()

  const settingsDefaultValue = account => {
    const settings = {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.login,
      language: account.langKey,
      profilePicture: null,
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
      if (values.profilePicture && values.profilePicture[0]) {
        fileContents = await readFileContent(values.profilePicture[0])
      }
      const settingsPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        langKey: values.language,
        login: values.email,
        avatarName: values.profilePicture && values.profilePicture[0] ? values.profilePicture[0].type : null,
        avatar: fileContents,
      }
      saveSettings(settingsPayload)
      setTimeout(() => {
        refetch()
      }, 2000) // call for refetch because we are getting no response from current api. Needs to change when correct response is receieved
      // setLanguage(values.language);
      i18n.changeLanguage(values.language)
    },
    [i18n, refetch, saveSettings],
  )

  return (
    <Box mt="40px" ml="20px" h="65vh">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text fontSize="18px" fontWeight={500} color="gray.600" fontStyle="normal" mb={8}>
          {/* {t('settingsFor')} [{account ? account.email : null}] */}
          Settings
        </Text>
        <Stack mb="10">
          <Text fontSize="16px" fontWeight={500} color="gray.600" fontStyle="normal">
            Profile Picture
          </Text>
          <HStack spacing={4}>
            <PreviewImg />
            <Text fontSize="14px" fontWeight={400} color="gray.600">
              Change your profile picture
            </Text>
          </HStack>
        </Stack>

        <Stack spacing={0} mb="14">
          <HStack alignItems="start">
            <Icon boxSize={5} as={BiBriefcase} color="gray.500" mt="2px" />
            <VStack align="start" spacing={0}>
              <Text fontSize="14px" fontWeight={500} color="gray.600">
                Email
              </Text>
              <Text fontSize="14px" fontWeight={400} color="gray.500">
                Vendor@devtek.ai
              </Text>
            </VStack>
          </HStack>

          <Divider w="280px" />
        </Stack>

        <HStack spacing={4}>
          <FormInput
            errorMessage={errors.firstName && errors.firstName?.message}
            label={t('firstName')}
            placeholder={'First Name'}
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
            placeholder="Last Name"
            register={register}
            controlStyle={{ w: '215px' }}
            elementStyle={{ bg: 'white' }}
            rules={{ required: 'This is required field' }}
            name={`lastName`}
          />
        </HStack>
        <Flex
          id="footer"
          w="100%"
          h="100px"
          mt="100px"
          alignItems="center"
          justifyContent="end"
          borderTop="2px solid #E2E8F0"
        >
          <Button colorScheme="brand" type="submit">
            {t('save')}
          </Button>
        </Flex>
      </form>
    </Box>
  )
})

export const PreviewImg = () => {
  const defaultImage = 'https://bit.ly/sage-adebayo'
  const [preview, setPreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputClick = e => {
    e.preventDefault()
    fileInputRef.current!.click()
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
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
