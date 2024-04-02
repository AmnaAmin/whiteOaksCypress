/*eslint-disable */
import {
  Box,
  VStack,
  Text,
  Image,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
  Divider,
  Flex,
  Center,
  TabPanels,
  TabList,
  TabPanel,
  Tabs,
  useTab,
  useMultiStyleConfig,
  Button,
  Tab,
  useToast,
  useMediaQuery,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react'
import { useStates } from 'api/pc-projects'
import { parseCreateVendorFormToAPIData, useMarkets, useTrades } from 'api/vendor-details'
import { useCheckUserExistance, useVendorRegister } from 'api/vendor-register'
import { ConstructionTradeCard } from 'components/vendor-register/construction-trade-card'
import { DocumentsCard } from 'components/vendor-register/documents-card'
import { LicenseCard } from 'components/vendor-register/license-card'
import { MarketListCard } from 'components/vendor-register/market-list-card'
import { Card } from 'features/login-form-centered/Card'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import Select from 'components/form/react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import PasswordStrengthBar, { measureStrength } from 'components/vendor-register/password-strength-bar'
import NumberFormat from 'react-number-format'
import { phoneRegex } from 'utils/form-validation'
import { isEmpty } from 'lodash'
import { validateWhitespace } from 'api/clients'

const CustomTab = React.forwardRef((props: any, ref: any) => {
  const tabProps = useTab({ ...props, ref })
  const isSelected = !!tabProps['aria-selected']

  const styles = useMultiStyleConfig('Tabs', tabProps)

  return (
    <Button
      {...tabProps}
      __css={styles.tab}
      _disabled={{
        color: '#7C7C7C !important',
      }}
      sx={{
        ':hover': {
          color: '#000',
          background: 'transparent !important',
          borderBottomColor: '#000',
        },
        borderBottomColor: isSelected ? '#345587 !important' : '#D9D9D9 !important',
        color: '#000000 !important',
        borderBottomWidth: '3px',
        whiteSpace: 'noWrap',
      }}
    >
      <Box as="span" mr="2" fontWeight={isSelected ? '500' : ''} fontSize="12px" background="transparent">
        {tabProps.children}
      </Box>
    </Button>
  )
})

export const validateTrade = trades => {
  const checkedTrades = trades?.filter(t => t.checked)
  if (!(checkedTrades && checkedTrades.length > 0)) {
    return false
  }
  return true
}

export const validateMarket = markets => {
  const checkedMarkets = markets?.filter(t => t.checked)
  if (!(checkedMarkets && checkedMarkets.length > 0)) {
    return false
  }
  return true
}

export const yupNullable = (_, val) => (val === '' ? undefined : _)

const vendorRegisterFormSchema = {
  email: Yup.string().email('Must be a valid email').required('Email is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last name is required'),
  password: Yup.string()
    .required('Password is required')
    .test(
      'len',
      'Password must contain a lower, upper, symbol and a special character',
      (val: any) => measureStrength(val)[1] >= 4,
    ),
  companyName: Yup.string().required('Business name is required'),

  //Location Details
  businessPhoneNumber: Yup.string().matches(phoneRegex, 'Phone Contact number is not valid'),

  /*businessPhoneNumber: Yup.string()
    .matches(phoneRegex, 'Phone Contact number is not valid')
    .required('Primary Contact is required'),
  secondaryContact: Yup.string().matches(phoneRegex, 'Secondary Contact number is not valid').transform(yupNullable),
  businessContact: Yup.string()
    .matches(phoneRegex, 'Business Contact number is not valid')
    .required('Business Contact is required'),
  businessContactExt: Yup.number().transform(yupNullable),
  secondaryPhone: Yup.string().matches(phoneRegex, 'Secondary Phone number is not valid').transform(yupNullable),
  secondaryPhoneExt: Yup.number().transform(yupNullable),*/
  businessEmailAddress: Yup.string()
    .email('Must be a valid email')
    .required('Email is required')
    .transform(yupNullable),
  secondEmailAddress: Yup.string().email('Must be a valid email').transform(yupNullable),
  streetAddress: Yup.string().required('Street Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.object().required('State is required'),
  zipCode: Yup.string().required('ZipCode is required'),
  capacity: Yup.number().required('Capacity is required').max(500, 'Max Limit is 500'),

  //Documents

  w9DocumentDate: Yup.string(),
  w9Document: Yup.mixed().required(),

  agreementSignedDate: Yup.string().required(),
  agreement: Yup.mixed().required(),

  autoInsuranceExpDate: Yup.string().required(),
  insurance: Yup.mixed().required(),

  coiGlExpDate: Yup.string().required(),
  coiGlExpFile: Yup.mixed().required(),

  coiWcExpDate: Yup.string().required(),
  coiWcExpFile: Yup.mixed().required(),

  //Licenses
  licenses: Yup.array().of(
    Yup.object().shape({
      licenseType: Yup.string().typeError('License Type must be a string').required('License Type is required'),
      licenseNumber: Yup.string().typeError('License Number must be a string').required('License Number is required'),
      expiryDate: Yup.string().typeError('Expiration Date must be a string').required('Expiration Date is required'),
      expirationFile: Yup.mixed().required('File is required'),
    }),
  ),

  //Trades or Vendor Skills
  trades: Yup.array().required(),
  // Markets
  markets: Yup.array().required(),
}

enum FORM_TABS {
  LOCATION_DETAILS,
  DOCUMENTS,
  LICENSE,
  CONSTRUCTION_TRADE,
  MARKETS,
}
export const VendorRegister = () => {
  const [formTabIndex, setformTabIndex] = useState<number>(FORM_TABS.LOCATION_DETAILS)
  const [ssnEinTabIndex, setSsnEinTabIndex] = useState<number>(0)
  const [disableLoginFields, setDisableLoginFields] = useState<boolean>(false)
  const [customResolver, setCustomResolver] = useState<any>(vendorRegisterFormSchema)
  const ref = useRef<HTMLFormElement>(null)
  const [showLoginFields, setShowLoginFields] = useState<boolean>(true)
  const [isMobile] = useMediaQuery('(max-width: 480px)')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [unLockedTabs, setUnLoackedTabs] = useState<Array<FORM_TABS>>([])
  const [isNextBtnActive, setisNextBtnActive] = useState<boolean>(false)
  const [isCreateButtonActive, setIsCreateButtonActive] = useState<boolean>(false)

  useEffect(() => {
    if (!isMobile) return

    if (formTabIndex !== FORM_TABS.LOCATION_DETAILS) setShowLoginFields(false)
  }, [isMobile])

  const formReturn = useForm({
    mode: 'onChange',
    resolver: yupResolver(Yup.object().shape(customResolver)),
    //validateCriteriaMode: 'firstErrorDetected'
  } as any)

  useEffect(() => {
    if (ssnEinTabIndex === 0) {
      setCustomResolver({
        ...vendorRegisterFormSchema,
        einNumber: Yup.string()
          .required('EIN is a required field')
          .matches(/^\d{2}-?\d{7}$/, 'Must be only digits'),
      })
    } else {
      setCustomResolver({
        ...vendorRegisterFormSchema,
        ssnNumber: Yup.string()
          .required('SSN is a required field')
          .matches(/^\d{3}-?\d{2}-?\d{4}$/, 'Must be only digits'),
      })
    }
  }, [ssnEinTabIndex])

  const { markets } = useMarkets()
  const { data: trades } = useTrades()
  const { stateSelectOptions } = useStates()
  const toast = useToast()

  const { mutate: createVendorAccount, error: errorOnRegister } = useVendorRegister()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    control,
    setError,
    setValue,
    getValues,
    trigger,
    watch,
  } = formReturn
  const formValues = getValues()

  const { data: verifyUserData, mutate: verifyUser } = useCheckUserExistance()

  const watchPassword = watch('password', '')

  useEffect(() => {
    if (markets?.length) {
      const tradeFormValues = {
        markets: markets.map(market => ({
          market,
          checked: false,
        })),
      }

      setValue('markets', tradeFormValues.markets)
    }

    if (trades?.length) {
      const tradeFormValues = {
        trades: trades.map(trade => ({
          trade,
          checked: false,
        })),
      }
      setValue('trades', tradeFormValues.trades)
    }
  }, [trades, markets])

  const handleLocationDetailsNext = useCallback(
    async ({ businessNameExist, emailAddressExist }) => {
      const isSsn = ssnEinTabIndex === 1 ? true : false
      let detailFields = [
        'email',
        'firstName',
        'lastName',
        'password',
        'companyName',
        'ownerName',
        'primaryContact',
        'secondName',
        'businessPhoneNumber',
        'businessPhoneNumberExtension',
        'secondPhoneNumber',
        'businessEmailAddress',
        'streetAddress',
        'city',
        'zipCode',
        'capacity',
        'einNumber',
        'ssnNumber',
        'secondEmailAddress',
        'state',
      ]
      if (isSsn) {
        detailFields = detailFields.filter(fN => fN !== 'einNumber')
      } else {
        detailFields = detailFields.filter(fN => fN !== 'ssnNumber')
      }
      for (const fieldName of detailFields) {
        await trigger(fieldName)
      }
      if (emailAddressExist) {
        setError('email', {
          type: 'custom',
          message: 'This user already exists. Please contact WhiteOaks team for further assistance',
        })
      }
      if (businessNameExist) {
        setError('companyName', {
          type: 'custom',
          message: 'This business name already exists. Please contact WhiteOaks team for further assistance',
        })
      }

      if (isEmpty(errors)) {
        setDisableLoginFields(true)
        setformTabIndex(FORM_TABS.DOCUMENTS)
        setUnLoackedTabs([...unLockedTabs, FORM_TABS.LOCATION_DETAILS])
      }
    },
    [trigger, setError, errors],
  )

  useEffect(() => {
    if (formTabIndex === FORM_TABS.LOCATION_DETAILS) setDisableLoginFields(false)
    if (formTabIndex === FORM_TABS.LOCATION_DETAILS && isMobile) setShowLoginFields(true)
    if (formTabIndex !== FORM_TABS.LOCATION_DETAILS && isMobile) setShowLoginFields(false)
  }, [formTabIndex])
  const userData = { companyName: formValues?.companyName, email: formValues?.email }
  const doNext = async () => {
    const documentFields = [
      'w9DocumentDate',
      'w9Document',
      'agreement',
      'agreementSignedDate',
      'insurance',
      'autoInsuranceExpDate',
      'coiGlExpFile',
      'coiGlExpDate',
      'coiWcExpFile',
      'coiWcExpDate',
    ]

    const licenseFieldName = 'licenses'

    const tradeFieldName = 'trades'

    if (formTabIndex === FORM_TABS.LOCATION_DETAILS) {
      verifyUser(userData, {
        onSuccess(res) {
          handleLocationDetailsNext(res?.data)
        },
      })
    }

    if (formTabIndex === FORM_TABS.DOCUMENTS) {
      for (const fieldName of documentFields) {
        if (!(await trigger(fieldName))) {
          return null
        }
      }

      setformTabIndex(FORM_TABS.LICENSE)
      setUnLoackedTabs([...unLockedTabs, FORM_TABS.DOCUMENTS])

      return null
    }

    if (formTabIndex === FORM_TABS.LICENSE) {
      if (!(await trigger(licenseFieldName))) {
        return null
      }

      setformTabIndex(FORM_TABS.CONSTRUCTION_TRADE)
      setUnLoackedTabs([...unLockedTabs, FORM_TABS.LICENSE])

      return null
    }

    if (formTabIndex === FORM_TABS.CONSTRUCTION_TRADE) {
      if (!validateTrade(getValues(tradeFieldName))) {
        showError('Trade')

        return null
      }

      setformTabIndex(FORM_TABS.MARKETS)
      setUnLoackedTabs([...unLockedTabs, FORM_TABS.MARKETS])
      setUnLoackedTabs([...unLockedTabs, FORM_TABS.CONSTRUCTION_TRADE])

      return null
    }
  }

  const doCancel = () => {
    return window && (window.location.href = '/login')

    if (formTabIndex !== FORM_TABS.LOCATION_DETAILS) setformTabIndex(FORM_TABS.LOCATION_DETAILS)

    if (ref.current) {
      ref.current?.reset()
    }

    const fieldsArr = [
      'email',
      'firstName',
      'lastName',
      'password',
      'companyName',
      'ownerName',
      'secondName',
      'businessPhoneNumber',
      'businessPhoneNumberExtension',
      'secondPhoneNumber',
      'businessEmailAddress',
      'streetAddress',
      'city',
      'zipCode',
      'capacity',
      'einNumber',
      'ssnNumber',
      'secondEmailAddress',
      'secondEmailAddress',
      'state',
    ]

    //reset( {} )

    setDisableLoginFields(false)
    setShowLoginFields(true)
    setUnLoackedTabs([])
  }

  const isTabDisabled = (tab: FORM_TABS): boolean => {
    if (formTabIndex !== tab && !unLockedTabs.includes(tab)) {
      return true
    }

    return false
  }

  const onSubmit = async formValues => {
    const firstName = formValues.firstName
    const lastName = formValues.lastName
    const password = formValues.password
    const email = formValues.email
    const login = email
    const streetAddress = formValues.streetAddress
    const city = formValues.city
    const telephoneNumber = formValues.telephoneNumber
    const state = formValues.state?.value
    const zipCode = formValues.zipCode
    const stateId = formValues.state?.id
    const vendorDetails: any = await parseCreateVendorFormToAPIData(formValues, [])

    vendorDetails.status = 12
    vendorDetails.score = 1
    vendorDetails.userType = 6
    vendorDetails.state = state

    const vendorObj = {
      status: 12,
      score: 1,
      userType: 6,
      firstName: firstName,
      lastName: lastName,
      password: password,
      email: email,
      login: login,
      streetAddress: streetAddress,
      city: city,
      zipCode: zipCode,
      telephoneNumber: telephoneNumber,
      vendorDetails: vendorDetails,
      stateId: stateId,
      state: state,
      isSsn: ssnEinTabIndex === 1 ? true : false,
    }

    createVendorAccount(vendorObj)
  }

  const showError = name => {
    toast({
      description: `Atleast one ${name} must be selected`,
      status: 'error',
      isClosable: true,
      position: 'top-left',
    })
  }

  const createUserVendorAccount = async (formValues: any) => {
    if (!validateMarket(formValues.markets)) {
      showError('Market')
    } else {
      onSubmit(formValues)
    }
  }

  const locationDetailFieldValues = {
    email: watch('email'),
    firstName: watch('firstName'),
    lastName: watch('lastName'),
    password: watch('password'),
    companyName: watch('companyName'),
    ownerName: watch('ownerName'),
    businessPhoneNumber: watch('businessPhoneNumber'),
    businessEmailAddress: watch('businessEmailAddress'),
    streetAddress: watch('streetAddress'),
    city: watch('city'),
    zipCode: watch('zipCode'),
    capacity: watch('capacity'),
    //'einNumber': watch("einNumber"),
    //'ssnNumber': watch("ssnNumber"),
    state: watch('state'),
    ...(ssnEinTabIndex === 0 ? { einNumber: watch('einNumber') } : {}),
    ...(ssnEinTabIndex === 1 ? { ssnNumber: watch('ssnNumber') } : {}),
  }

  const locationDetailsSchema = {
    email: Yup.string().required('Email is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last name is required'),
    password: Yup.string().required('Password is required'),
    companyName: Yup.string().required('Business name is required'),
    ownerName: Yup.string().required('OwnerName is required'),
    businessPhoneNumber: Yup.string().required(),
    streetAddress: Yup.string().required('Street Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.object().required('State is required'),
    zipCode: Yup.string().required('ZipCode is required'),
    capacity: Yup.string().required('Capacity is required'),
    ...(ssnEinTabIndex === 0
      ? {
          einNumber: Yup.string()
            .required('EIN is a required field')
            .matches(/^\d{2}-?\d{7}$/, 'Must be only digits'),
        }
      : {}),
    ...(ssnEinTabIndex === 1
      ? {
          ssnNumber: Yup.string()
            .required('SSN is a required field')
            .matches(/^\d{3}-?\d{2}-?\d{4}$/, 'Must be only digits'),
        }
      : {}),
  }

  const documentFieldValues = {
    w9DocumentDate: watch('w9DocumentDate'),
    w9Document: watch('w9Document'),

    agreementSignedDate: watch('agreementSignedDate'),
    agreement: watch('agreement'),

    autoInsuranceExpDate: watch('autoInsuranceExpDate'),
    insurance: watch('insurance'),

    coiGlExpDate: watch('coiGlExpDate'),
    coiGlExpFile: watch('coiGlExpFile'),

    coiWcExpDate: watch('coiWcExpDate'),
    coiWcExpFile: watch('coiWcExpFile'),
  }

  const documentSchema = {
    w9DocumentDate: Yup.string(),
    w9Document: Yup.mixed().required(),

    agreementSignedDate: Yup.string().required(),
    agreement: Yup.mixed().required(),

    autoInsuranceExpDate: Yup.string().required(),
    insurance: Yup.mixed().required(),

    coiGlExpDate: Yup.string().required(),
    coiGlExpFile: Yup.mixed().required(),

    coiWcExpDate: Yup.string().required(),
    coiWcExpFile: Yup.mixed().required(),
  }

  const licenseFieldValues = {
    licenses: watch('licenses'),
  }

  const licenseFieldSchema = {
    licenses: Yup.array().of(
      Yup.object().shape({
        licenseType: Yup.string().typeError('License Type must be a string').required('License Type is required'),
        licenseNumber: Yup.string().typeError('License Number must be a string').required('License Number is required'),
        expiryDate: Yup.string().typeError('Expiration Date must be a string').required('Expiration Date is required'),
        expirationFile: Yup.mixed().required('File is required'),
      }),
    ),
  }

  const tradeFieldValues = {
    trades: watch('trades'),
  }

  const marketFieldValues = {
    markets: watch('markets'),
  }

  useEffect(() => {
    if (formTabIndex === FORM_TABS.LOCATION_DETAILS) {
      Yup.object(locationDetailsSchema)
        .validate(locationDetailFieldValues, { strict: true })
        .then(value => {
          setisNextBtnActive(true)
        })
        .catch(err => {
          setisNextBtnActive(false)
        })
    }

    if (formTabIndex === FORM_TABS.DOCUMENTS) {
      Yup.object(documentSchema)
        .validate(documentFieldValues, { strict: true })
        .then(value => {
          setisNextBtnActive(true)
        })
        .catch(err => {
          setisNextBtnActive(false)
        })
    }

    if (formTabIndex === FORM_TABS.LICENSE) {
      Yup.object(licenseFieldSchema)
        .validate(licenseFieldValues, { strict: true })
        .then(value => {
          setisNextBtnActive(true)
        })
        .catch(err => setisNextBtnActive(false))
    }

    if (formTabIndex === FORM_TABS.CONSTRUCTION_TRADE) {
      validateTrade(tradeFieldValues.trades) ? setisNextBtnActive(true) : setisNextBtnActive(false)
    }

    if (formTabIndex === FORM_TABS.MARKETS) {
      validateMarket(marketFieldValues.markets) ? setIsCreateButtonActive(true) : setIsCreateButtonActive(false)
    }
  }, [locationDetailFieldValues, documentFieldValues, licenseFieldValues, tradeFieldValues, marketFieldValues])

  const formLabeStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'gray.700',
  }
  const placeholderStyle = {
    fontSize: '14px',
    fontWeight: 400,
    color: 'gray.500',
  }
  const [companyName, setCompanyName] = useState('')

  // Function to handle input change and trim spaces
  const handleInputChange = e => {
    const trimmedValue = e.target.value // Trim spaces from the input
    setCompanyName(trimmedValue) // Update the state with the trimmed value
  }
  return (
    <Box
      bgImg="url(./bg.svg)"
      bgRepeat="no-repeat"
      bgSize="cover"
      minH={{ sm: 'auto', md: '100vh' }}
      py="12"
      px={{ base: '4', lg: '8' }}
      display="flex"
      dir="column"
      alignItems="center"
      maxW="100%"
      overflow="hidden"
    >
      <Box w={{ sm: '100%', lg: '1200px' }} mx="auto" overflow="hidden">
        <Card
          rounded="10px"
          bg="#F5F5F5;"
          opacity="1"
          height="auto"
          minH={{ sm: 'auto' }}
          overflow="hidden"
          pt="40px"
          pb="39px"
        >
          <FormProvider {...formReturn}>
            <form onSubmit={handleSubmit(createUserVendorAccount)} autoComplete="off" ref={ref}>
              <HStack
                spacing={{ sm: '0px', md: '50px' }}
                alignItems="flex-start"
                flexDir={{ base: 'column', lg: 'row' }}
              >
                <Box width={{ sm: '100%', lg: '30%' }}>
                  <VStack
                    alignItems="baseline"
                    sx={{
                      '@media only screen and (max-width:480px)': {
                        alignItems: 'center',
                      },
                    }}
                  >
                    <Box w="105px" h="140px">
                      <Image src="./logo-reg-vendor.svg" />
                      <Image src="./WhiteOaks.svg" mt="10px" />
                    </Box>
                    <Box>
                      <Heading fontSize="30px" fontWeight={500} color="#345587">
                        Vendor Registration
                      </Heading>
                      <Text fontSize="13px" fontWeight={400} color="#8392AB" mb="5px" mt="5px">
                        Please fill the below form for vendor registration.
                      </Text>
                    </Box>
                    <Center width="100%">
                      <Divider
                        orientation="horizontal"
                        borderColor="#C5C5C5 !important"
                        bg="#C5C5C5"
                        w="100%"
                        opacity="1"
                      />
                    </Center>
                  </VStack>

                  <Stack spacing="13px" mt="30px" display={showLoginFields ? 'block' : 'none'}>
                    <FormControl isInvalid={errors?.email}>
                      <FormLabel htmlFor="email" sx={formLabeStyle}>
                        Email Address
                      </FormLabel>
                      <Input
                        data-testid="email_vendor"
                        id="email"
                        type="email"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Please enter your email address"
                        _placeholder={placeholderStyle}
                        {...register('email', {
                          required: 'This is required',
                          onChange: e => setValue('businessEmailAddress', e.target.value),
                        })}
                        tabIndex={1}
                        autoComplete="new-email"
                        variant="required-field"
                      />
                      <FormErrorMessage>{errors?.email && errors?.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.firstName}>
                      <FormLabel htmlFor="firstName" sx={formLabeStyle}>
                        First Name
                      </FormLabel>
                      <Input
                        data-testid="firstName_vendor"
                        id="firstName"
                        type="text"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your first name"
                        _placeholder={placeholderStyle}
                        {...register('firstName', {
                          required: 'This is required',
                          onChange: e => setValue('primaryContact', e.target.value + ' ' + getValues('lastName')),
                        })}
                        tabIndex={2}
                        variant="required-field"
                      />
                      <FormErrorMessage>{errors?.firstName && errors?.firstName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.lastName}>
                      <FormLabel htmlFor="lastName" sx={formLabeStyle}>
                        Last Name
                      </FormLabel>
                      <Input
                        data-testid="lastName_vendor"
                        id="lastName"
                        type="text"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your last name"
                        _placeholder={placeholderStyle}
                        {...register('lastName', {
                          required: 'This is required',
                          onChange: e => setValue('primaryContact', getValues('firstName') + ' ' + e.target.value),
                        })}
                        tabIndex={3}
                        variant="required-field"
                      />
                      <FormErrorMessage>{errors?.lastName && errors?.lastName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.password}>
                      <FormLabel htmlFor="password" sx={formLabeStyle}>
                        Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          data-testid="password_vendor"
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          fontSize="14px"
                          color="#252F40"
                          disabled={disableLoginFields}
                          placeholder="Enter your password"
                          _placeholder={placeholderStyle}
                          {...register('password', {
                            required: 'This is required',
                          })}
                          tabIndex={4}
                          autoComplete="new-password"
                          variant="required-field"
                        />
                        <InputRightElement
                          mr="12px"
                          cursor="pointer"
                          children={
                            showPassword ? (
                              <Text
                                fontSize="12px"
                                fontWeight="400"
                                color="#B5B8BB"
                                onClick={() => setShowPassword(false)}
                              >
                                HIDE
                              </Text>
                            ) : (
                              <Text
                                fontSize="12px"
                                fontWeight="400"
                                color="#B5B8BB"
                                onClick={() => setShowPassword(true)}
                              >
                                SHOW
                              </Text>
                            )
                          }
                        />
                      </InputGroup>
                      <PasswordStrengthBar password={watchPassword} />
                      <FormErrorMessage>{errors?.password && errors?.password?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.companyName}>
                      <FormLabel htmlFor="companyName" sx={formLabeStyle}>
                        Business Name
                      </FormLabel>

                      <Input
                        data-testid="businessName_vendor"
                        id="companyName"
                        type="text"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your business name"
                        _placeholder={placeholderStyle}
                        {...register('companyName', {
                          required: 'This is required',
                          validate: {
                            whitespace: validateWhitespace,
                          },
                        })}
                        tabIndex={5}
                        value={companyName} // Use the state variable as the input value
                        onChange={handleInputChange}
                        variant="required-field"
                      />
                      <FormErrorMessage>{errors?.companyName && errors?.companyName?.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Box>
                <Flex>
                  <Stack
                    direction="row"
                    h="557px"
                    p={4}
                    sx={{
                      '@media only screen and (max-width: 480px)': {
                        display: 'none !important',
                      },
                      '@media only screen and (max-width: 900px)': {
                        display: 'none !important',
                      },
                    }}
                  >
                    <Divider
                      orientation="vertical"
                      borderWidth="1px"
                      opacity="1"
                      rounded="3xl"
                      position="relative"
                      top="calc(98% - 400px);"
                      borderColor="#E2E8F0 !important"
                    />
                  </Stack>
                </Flex>
                <Flex
                  alignItems="center"
                  w={{ sm: '100%', lg: '60%' }}
                  maxW="800px"
                  sx={{
                    '@media only screen and (max-width: 480px)': {
                      marginTop: '30px !important',
                    },
                    '@media only screen and (min-width: 500px) and (max-width: 900px)': {
                      marginTop: '30px !important',
                      marginInline: '0 !important',
                    },
                  }}
                >
                  <VStack w="100%">
                    <Tabs
                      w={{ sm: '100%', md: '680px' }}
                      onChange={index => setformTabIndex(index)}
                      index={formTabIndex}
                    >
                      <TabList
                        flexDir={{ base: 'column', sm: 'row' }}
                        gap="1px"
                        w={{ lg: 'calc(100% - 110px)' }}
                        ml={{ lg: '10' }}
                      >
                        <CustomTab isDisabled={isTabDisabled(FORM_TABS.LOCATION_DETAILS)}>Location Details</CustomTab>
                        <CustomTab isDisabled={isTabDisabled(FORM_TABS.DOCUMENTS)}>Documents</CustomTab>
                        <CustomTab isDisabled={isTabDisabled(FORM_TABS.LICENSE)}>License</CustomTab>
                        <CustomTab isDisabled={isTabDisabled(FORM_TABS.CONSTRUCTION_TRADE)}>
                          Construction Skill
                        </CustomTab>
                        <CustomTab isDisabled={isTabDisabled(FORM_TABS.MARKETS)}>Markets</CustomTab>
                      </TabList>

                      <TabPanels>
                        <TabPanel py="0px">
                          <HStack
                            alignItems={'start'}
                            mt="30px"
                            spacing={{ sm: '0', md: '70px' }}
                            flexDir={{ base: 'column', sm: 'row' }}
                          >
                            <VStack w={{ sm: '100%', md: '50%' }} spacing="20px">
                              <FormControl isInvalid={errors?.primaryContact}>
                                <FormLabel htmlFor="primaryContact" sx={formLabeStyle}>
                                  Primary Contact
                                </FormLabel>
                                <Input
                                  data-testid="primaryContact_vendor"
                                  w="283px"
                                  id="primaryContact"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your primary contact"
                                  _placeholder={placeholderStyle}
                                  {...register('primaryContact', {
                                    required: 'This is required',
                                  })}
                                  variant="required-field"
                                />
                                <FormErrorMessage>
                                  {errors?.primaryContact && errors?.primaryContact?.message}
                                </FormErrorMessage>
                              </FormControl>
                              <HStack w="100%" spacing="5px">
                                <Box w="80%">
                                  <FormControl isInvalid={errors?.businessPhoneNumber}>
                                    <FormLabel htmlFor="businessPhoneNumber" sx={formLabeStyle}>
                                      Business Phone Number
                                    </FormLabel>
                                    <Controller
                                      control={control}
                                      name="businessPhoneNumber"
                                      render={({ field }) => {
                                        return (
                                          <NumberFormat
                                            data-testid="businessPhone_vendor"
                                            customInput={Input}
                                            value={field.value}
                                            onChange={e => field.onChange(e)}
                                            format="(###)-###-####"
                                            color="#718096"
                                            mask="_"
                                            placeholder="(___)-___-____"
                                            _placeholder={{
                                              color: '#718096',
                                            }}
                                            borderLeft="2.5px solid #345587"
                                            tabIndex={6}
                                          />
                                        )
                                      }}
                                    />
                                    <FormErrorMessage>
                                      {errors?.businessPhoneNumber && errors?.businessPhoneNumber?.message}
                                    </FormErrorMessage>
                                  </FormControl>
                                </Box>
                                <Box w="20%">
                                  <FormControl isInvalid={errors?.businessPhoneNumberExtension}>
                                    <FormLabel htmlFor="businessPhoneNumberExtension" sx={formLabeStyle}>
                                      Ext.
                                    </FormLabel>
                                    <Input
                                      id="businessPhoneNumberExtension"
                                      type="number"
                                      fontSize="14px"
                                      color="#252F40"
                                      placeholder=""
                                      {...register('businessPhoneNumberExtension', {})}
                                    />
                                    <FormErrorMessage>
                                      {errors?.businessPhoneNumberExt && errors?.businessPhoneNumberExt?.message}
                                    </FormErrorMessage>
                                  </FormControl>
                                </Box>
                              </HStack>
                              <FormControl isInvalid={errors?.businessEmailAddress}>
                                <FormLabel htmlFor="businessEmailAddress" sx={formLabeStyle}>
                                  Primary Email Address
                                </FormLabel>
                                <Input
                                  data-testid="primaryEmail_vendor"
                                  id="businessEmailAddress"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your primary email address"
                                  _placeholder={placeholderStyle}
                                  {...register('businessEmailAddress', {
                                    required: 'This is required',
                                  })}
                                  variant="required-field"
                                />
                                <FormErrorMessage>
                                  {errors?.businessEmailAddress && errors?.businessEmailAddress?.message}
                                </FormErrorMessage>
                              </FormControl>
                              <FormControl isInvalid={errors?.ownerName}>
                                <FormLabel htmlFor="ownersName" sx={formLabeStyle}>
                                  Owner's Name
                                </FormLabel>
                                <Input
                                  data-testid="ownerName_vendor"
                                  id="ownersName"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  _placeholder={placeholderStyle}
                                  {...register('ownerName', {
                                    required: 'This is required',
                                  })}
                                  variant="required-field"
                                />
                                <FormErrorMessage>{errors?.ownerName && errors?.ownerName?.message}</FormErrorMessage>
                              </FormControl>
                            </VStack>

                            <VStack
                              w={{ sm: '100%', md: '50%' }}
                              spacing="20px"
                              alignItems={'start'}
                              sx={{
                                '@media only screen and (max-width: 480px)': {
                                  marginTop: '20px !important',
                                  width: '100% !important',
                                },
                              }}
                            >
                              <FormControl isInvalid={errors?.secondName}>
                                <FormLabel htmlFor="secondName" sx={formLabeStyle}>
                                  Secondary Contact
                                </FormLabel>
                                <Input
                                  data-testid="secondary_vendor"
                                  id="secondName"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your secondary contact"
                                  _placeholder={placeholderStyle}
                                  {...register('secondName')}
                                />
                                <FormErrorMessage>{errors?.secondName && errors?.secondName?.message}</FormErrorMessage>
                              </FormControl>

                              <FormControl isInvalid={errors?.secondaryPhone}>
                                <FormLabel htmlFor="secondPhoneNumber" sx={formLabeStyle}>
                                  Secondary Phone Number
                                </FormLabel>
                                <Input
                                  data-testid="secondaryPhone_vendor"
                                  id="secondPhoneNumber"
                                  type="number"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Enter your secondary phone number"
                                  _placeholder={placeholderStyle}
                                  {...register('secondPhoneNumber')}
                                />
                                <FormErrorMessage>
                                  {errors?.secondaryPhone && errors?.secondaryPhone?.message}
                                </FormErrorMessage>
                              </FormControl>

                              <FormControl isInvalid={errors?.secondEmailAddress}>
                                <FormLabel htmlFor="secondEmailAddress" sx={formLabeStyle}>
                                  Secondary Email Address
                                </FormLabel>
                                <Input
                                  data-testid="secondaryEmail_vendor"
                                  id="secondEmailAddress"
                                  type="email"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your secondary email address"
                                  _placeholder={placeholderStyle}
                                  {...register('secondEmailAddress')}
                                />
                                <FormErrorMessage>
                                  {errors?.secondEmailAddress && errors?.secondEmailAddress?.message}
                                </FormErrorMessage>
                              </FormControl>
                            </VStack>
                          </HStack>

                          <Tabs
                            index={ssnEinTabIndex}
                            onChange={index => setSsnEinTabIndex(index)}
                            w="100%"
                            my="4"
                            variant="solid-rounded"
                          >
                            <TabList h="25px" ml="2" gap="4px">
                              <Tab
                                fontSize="12px"
                                fontWeight="500"
                                _selected={{ bg: '#345587', color: 'white' }}
                                borderRadius="3px 3px 0px 0px"
                                color="#A0A2A6"
                                bg="#D9D9D9"
                              >
                                EIN
                              </Tab>
                              <Tab
                                color="#A0A2A6"
                                bg="#D9D9D9"
                                fontSize="12px"
                                fontWeight="500"
                                _selected={{ bg: '#345587', color: 'white' }}
                                borderRadius="3px 3px 0px 0px"
                              >
                                SSN
                              </Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel p="0px">
                                <FormControl isInvalid={errors?.einNumber}>
                                  <Input
                                    data-testid="ein_vendor"
                                    as={InputMask}
                                    id="einNumber"
                                    type="text"
                                    fontSize="14px"
                                    color="#718096"
                                    mask="99-9999999"
                                    {...register('einNumber', {
                                      required: 'This is required',
                                    })}
                                    variant="required-field"
                                  />
                                  <FormErrorMessage>{errors?.einNumber && errors?.einNumber?.message}</FormErrorMessage>
                                </FormControl>
                              </TabPanel>
                              <TabPanel p="0px">
                                <FormControl isInvalid={errors?.ssnNumber}>
                                  <Input
                                    data-testid="ssn_vendor"
                                    as={InputMask}
                                    id="ssnNumber"
                                    type="text"
                                    fontSize="14px"
                                    color="#718096"
                                    mask="999-99-9999"
                                    {...register('ssnNumber')}
                                    variant="required-field"
                                  />
                                  <FormErrorMessage>{errors?.ssnNumber && errors?.ssnNumber?.message}</FormErrorMessage>
                                </FormControl>
                              </TabPanel>
                            </TabPanels>
                          </Tabs>

                          <VStack w="100%" spacing="20px" mb="20px">
                            <FormControl isInvalid={errors?.streetAddress}>
                              <FormLabel htmlFor="streetAddress" sx={formLabeStyle}>
                                Street Address
                              </FormLabel>
                              <Input
                                data-testid="streetAddress_vendor"
                                id="streetAddress"
                                type="text"
                                fontSize="14px"
                                color="#252F40"
                                placeholder="Please enter your street address"
                                _placeholder={placeholderStyle}
                                {...register('streetAddress', {
                                  required: 'This is required',
                                })}
                                variant="required-field"
                              />
                              <FormErrorMessage>
                                {errors?.streetAddress && errors?.streetAddress?.message}
                              </FormErrorMessage>
                            </FormControl>
                          </VStack>

                          <VStack w="100%">
                            <HStack
                              w="100%"
                              spacing={{ sm: '0', md: '70px' }}
                              flexDir={{ base: 'column', sm: 'row' }}
                              sx={{
                                '@media only screen and (max-width: 480px)': {
                                  marginTop: '20px !important',
                                },
                              }}
                            >
                              <FormControl isInvalid={errors?.city}>
                                <FormLabel htmlFor="city" sx={formLabeStyle}>
                                  City
                                </FormLabel>
                                <Input
                                  data-testid="city_vendor"
                                  id="city"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your city"
                                  _placeholder={placeholderStyle}
                                  {...register('city', {
                                    required: 'This is required',
                                  })}
                                  variant="required-field"
                                />
                                <FormErrorMessage>{errors?.city && errors?.city?.message}</FormErrorMessage>
                              </FormControl>
                              <FormControl
                                isInvalid={!!errors?.state}
                                sx={{
                                  '@media only screen and (max-width: 480px)': {
                                    marginTop: '20px !important',
                                  },
                                }}
                              >
                                <FormLabel htmlFor="state" sx={formLabeStyle}>
                                  State
                                </FormLabel>
                                <Controller
                                  control={control}
                                  name={`state`}
                                  rules={{ required: 'This is required' }}
                                  render={({ field, fieldState }) => (
                                    <>
                                      <Select
                                       classNamePrefix={'vendorState'}
                                        data-testid="state_vendor"
                                        selectProps={{ isBorderLeft: true }}
                                        {...field}
                                        options={stateSelectOptions}
                                        selected={field.value}
                                        onChange={option => field.onChange(option)}
                                        className="state-option-vendor-register"
                                        maxMenuHeight={150}
                                        minMenuHeight={150}
                                      />
                                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                    </>
                                  )}
                                />
                              </FormControl>
                            </HStack>
                            <HStack
                              w="100%"
                              flexDir={{ base: 'column', sm: 'row' }}
                              spacing={{ sm: '0', md: '70px' }}
                              sx={{
                                '@media only screen and (max-width: 480px)': {
                                  marginTop: '20px !important !important',
                                },
                              }}
                            >
                              <FormControl
                                isInvalid={errors?.zipCode}
                                sx={{
                                  '@media only screen and (max-width: 480px)': {
                                    marginTop: '20px !important',
                                  },
                                }}
                              >
                                <FormLabel htmlFor="zipCode" sx={formLabeStyle}>
                                  Zip Code
                                </FormLabel>
                                <Input
                                  data-testid="zipCode_vendor"
                                  id="zipCode"
                                  type="number"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your zip code"
                                  _placeholder={placeholderStyle}
                                  {...register('zipCode', {
                                    required: 'This is required',
                                  })}
                                  variant="required-field"
                                />
                                <FormErrorMessage>{errors?.city && errors?.city?.message}</FormErrorMessage>
                              </FormControl>
                              <FormControl
                                isInvalid={errors?.capacity}
                                sx={{
                                  '@media only screen and (max-width: 480px)': {
                                    marginTop: '20px !important',
                                  },
                                }}
                                h="69px"
                              >
                                <FormLabel htmlFor="capacity" sx={formLabeStyle}>
                                  Capacity
                                </FormLabel>
                                <Input
                                  data-testid="capacity_vendor"
                                  id="capacity"
                                  type="number"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your capacity"
                                  _placeholder={placeholderStyle}
                                  {...register('capacity', {
                                    required: 'This is required',
                                    max: 500,
                                  })}
                                  variant="required-field"
                                  max="500"
                                />
                                <FormErrorMessage>{errors?.capacity && errors?.capacity?.message}</FormErrorMessage>
                              </FormControl>
                            </HStack>
                            <Box w="calc(100% - 10px)" pt="24px">
                              <Divider
                                orientation="horizontal"
                                borderWidth="0.8px"
                                opacity="1"
                                borderColor="#E2E8F0"
                                bg="#E2E8F0"
                              />
                            </Box>
                          </VStack>
                        </TabPanel>
                        <TabPanel p={{ sm: 0, md: '1rem' }}>
                          <DocumentsCard isActive={formTabIndex === FORM_TABS.DOCUMENTS} />
                        </TabPanel>
                        <TabPanel p={{ sm: 0, md: '1rem' }}>
                          <LicenseCard isActive={formTabIndex === FORM_TABS.LICENSE} />
                        </TabPanel>
                        <TabPanel
                          p={{ sm: '1rem', md: '1rem' }}
                          sx={{
                            '@media only screen and (max-width: 480px)': {
                              width: '345px',
                              marginBottom: '20px',
                              marginTop: '20px',
                            },
                          }}
                        >
                          <ConstructionTradeCard isActive={formTabIndex === FORM_TABS.CONSTRUCTION_TRADE} />
                        </TabPanel>
                        <TabPanel
                          p={{ sm: '1rem', md: '1rem' }}
                          sx={{
                            '@media only screen and (max-width: 480px)': {
                              marginTop: '30px !important',
                            },
                          }}
                        >
                          <MarketListCard isActive={formTabIndex === FORM_TABS.MARKETS} />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>

                    <HStack
                      spacing="16px"
                      position="relative"
                      left="34.4%"
                      marginTop="30px !important"
                      sx={{
                        '@media only screen and (max-width: 480px)': {
                          position: 'static',
                          marginTop: '30px !important',
                          marginBottom: '30px !important',
                        },
                      }}
                    >
                      <Button
                        onClick={doCancel}
                        bgColor="#FFFFFF"
                        width="78px"
                        h="40px"
                        borderRadius="8px"
                        fontSize="14px"
                        borderWidth="1px"
                        borderColor="#345587"
                        fontWeight="bold"
                        color="#345587"
                      >
                        Cancel
                      </Button>
                      {FORM_TABS.MARKETS !== formTabIndex && (
                        <Button
                          data-testid="next_vendor"
                          onClick={doNext}
                          disabled={!isNextBtnActive}
                          bgColor="#345587"
                          width="78px"
                          h="40px"
                          borderRadius="8px"
                          fontSize="14px"
                          borderWidth="1px"
                          borderColor="#345587"
                          fontWeight="bold"
                          colorScheme="brand"
                        >
                          Next
                        </Button>
                      )}
                      {FORM_TABS.MARKETS === formTabIndex && (
                        <Button
                          bgColor="#345587"
                          width="154px"
                          borderRadius="8px"
                          fontSize="14px"
                          borderWidth="1px"
                          borderColor="#345587"
                          fontWeight="bold"
                          type="submit"
                          disabled={!isCreateButtonActive}
                          colorScheme="brand"
                        >
                          Create Account
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </Flex>
              </HStack>
            </form>
          </FormProvider>
        </Card>
      </Box>
    </Box>
  )
}
