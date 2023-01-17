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
} from '@chakra-ui/react'
import { useStates } from 'api/pc-projects'
import { parseCreateVendorFormToAPIData, useMarkets, useTrades } from 'api/vendor-details'
import { useVendorRegister } from 'api/vendor-register'
import { ConstructionTradeCard } from 'components/vendor-register/construction-trade-card'
import { DocumentsCard } from 'components/vendor-register/documents-card'
import { LicenseCard } from 'components/vendor-register/license-card'
import { MarketListCard } from 'components/vendor-register/market-list-card'
import { Card } from 'features/login-form-centered/Card'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import Select from 'components/form/react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

const CustomTab = React.forwardRef((props: any, ref: any) => {
  const tabProps = useTab({ ...props, ref })
  const isSelected = !!tabProps['aria-selected']

  const styles = useMultiStyleConfig('Tabs', tabProps)

  return (
    <Button
      {...tabProps}
      __css={styles.tab}
      sx={{
        ':hover': {
          color: '#000',
          background: 'transparent !important',
          borderBottomColor: '#000',
        },
        borderBottomColor: isSelected ? '#000 !important' : '#D9D9D9 !important',
        color: '#000 !important',
      }}
    >
      <Box as="span" mr="2" fontWeight={isSelected ? 'bold' : ''} fontSize="12px" background="transparent">
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

const measureStrength = (p: string): [number, number] => {
  let force = 0
  const regex = /[$&+,:;=?@#|'<>.^*()%!-]/g
  const flags = {
    lowerLetters: /[a-z]+/.test(p),
    upperLetters: /[A-Z]+/.test(p),
    numbers: /[0-9]+/.test(p),
    symbols: regex.test(p),
  }

  const passedMatches = Object.values(flags).filter((isMatchedFlag: boolean) => !!isMatchedFlag).length

  force += 2 * p.length + (p.length >= 10 ? 1 : 0)
  force += passedMatches * 10

  // penalty (short password)
  force = p.length <= 6 ? Math.min(force, 10) : force

  // penalty (poor variety of characters)
  force = passedMatches === 1 ? Math.min(force, 10) : force
  force = passedMatches === 2 ? Math.min(force, 20) : force
  force = passedMatches === 3 ? Math.min(force, 40) : force

  return [force, passedMatches]
}

const defaultColor = 'rgb(221, 221, 221)'

const colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0']
const PasswordStrengthBar = ({ password }: any) => {
  const getColor = (s: number): any => {
    let idx = 0
    if (s <= 10) {
      idx = 0
    } else if (s <= 20) {
      idx = 1
    } else if (s <= 30) {
      idx = 2
    } else if (s <= 40) {
      idx = 3
    } else {
      idx = 4
    }
    return { idx: idx + 1, col: colors[idx] }
  }

  const getPoints = force => {
    const pts = [] as any[]
    for (let i = 0; i < 5; i++) {
      pts.push(
        <li
          key={i}
          className="point"
          style={i < force.idx ? { backgroundColor: force.col } : { backgroundColor: '#DDD' }}
        />,
      )
    }
    return pts
  }

  const strength = password ? getColor(measureStrength(password)[0]) : defaultColor
  const points = getPoints(strength)

  return (
    <div id="strength" className="form-group">
      <label className="mb-0 PasswordStrength-Label">
        <small>Password strength:</small>
      </label>
      <ul id="strengthBar" className="pl-0 mb-0">
        {points}
      </ul>
    </div>
  )
}

export const phoneRegex = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

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
  secondaryEmail: Yup.string().email('Must be a valid email').transform(yupNullable),
  streetAddress: Yup.string().required('Street Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.object().required('State is required'),
  zipCode: Yup.string().required('ZipCode is required'),
  capacity: Yup.string().required('Capacity is required').matches(/^\d+$/, 'Must be a digit'),

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

  useEffect(() => {
    if (!isMobile) return

    if (formTabIndex !== FORM_TABS.LOCATION_DETAILS) setShowLoginFields(false)
  }, [isMobile])

  const formReturn = useForm({
    //mode: "onChange",
    resolver: yupResolver(Yup.object().shape(customResolver)),
    //validateCriteriaMode: 'firstErrorDetected'
  } as any)

  useEffect(() => {
    if (ssnEinTabIndex === 0) {
      setCustomResolver({
        ...vendorRegisterFormSchema,
        einNumber: Yup.string()
          .required('EIN is a required field')
          .matches(/^\d{3}-?\d{2}-?\d{4}$/, 'Must be only digits'),
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

  const { mutate: createVendorAccount } = useVendorRegister()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    getValues,
    trigger,
  } = formReturn

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

  const doNext = async () => {
    const isSsn = ssnEinTabIndex === 1 ? true : false

    let detailFields = [
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

    if (isSsn) {
      detailFields = detailFields.filter(fN => fN !== 'einNumber')
    } else {
      detailFields = detailFields.filter(fN => fN !== 'ssnNumber')
    }

    if (formTabIndex === FORM_TABS.LOCATION_DETAILS) {
      for (const fieldName of detailFields) {
        if (!(await trigger(fieldName))) return null
      }

      setDisableLoginFields(true)
      setformTabIndex(FORM_TABS.DOCUMENTS)

      return null
    }

    if (formTabIndex === FORM_TABS.DOCUMENTS) {
      for (const fieldName of documentFields) {
        if (!(await trigger(fieldName))) {
          return null
        }
      }

      setformTabIndex(FORM_TABS.LICENSE)

      return null
    }

    if (formTabIndex === FORM_TABS.LICENSE) {
      if (!(await trigger(licenseFieldName))) {
        return null
      }

      setformTabIndex(FORM_TABS.CONSTRUCTION_TRADE)

      return null
    }

    if (formTabIndex === FORM_TABS.CONSTRUCTION_TRADE) {
      if (!validateTrade(getValues(tradeFieldName))) {
        showError('Trade')

        return null
      }

      setformTabIndex(FORM_TABS.MARKETS)

      return null
    }
  }

  const doCancel = () => {
    if (formTabIndex !== FORM_TABS.LOCATION_DETAILS) setformTabIndex(FORM_TABS.LOCATION_DETAILS)

    if (ref.current) {
      ref.current.reset()
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
  }

  const onSubmit = async formValues => {
    const firstName = formValues.firstName
    const lastName = formValues.lastName
    const password = formValues.password
    const email = formValues.email
    const login = email
    const streetAddress = formValues.streetAddress
    const telephoneNumber = formValues.telephoneNumber
    const state = formValues.state?.value

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
      telephoneNumber: telephoneNumber,
      vendorDetails: vendorDetails,
      stateId: state,
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
    })
  }

  const createUserVendorAccount = async (formValues: any) => {
    if (!validateMarket(formValues.markets)) {
      showError('Market')
    } else {
      onSubmit(formValues)
    }
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
          borderBottomLeftRadius="0px !important"
          borderBottomRightRadius="0px !important"
          bg="#F5F5F5;"
          py="10px !important"
          opacity="1"
          height="auto"
          minH={{ sm: 'auto', md: '90vh' }}
          overflow="hidden"
        >
          <FormProvider {...formReturn}>
            <form onSubmit={handleSubmit(createUserVendorAccount)} autoComplete="off" ref={ref}>
              <HStack
                spacing={{ sm: '0px', md: '50px' }}
                alignItems="flex-start"
                flexDir={{ base: 'column', sm: 'row' }}
              >
                <Box width={{ sm: '100%', md: '30%' }}>
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
                      <Heading fontSize="26px" color="#345587">
                        Vendor Registration
                      </Heading>
                      <Text fontSize="14px" color="#8392AB" mb="10px">
                        Please fill the below form for vendor registration.
                      </Text>
                    </Box>
                    <Center width="100%">
                      <Divider
                        orientation="horizontal"
                        border="1px solid #C5C5C5"
                        backgroundColor="#C5C5C5"
                        borderColor="#C5C5C5 !important"
                        w="100%"
                        opacity="1"
                      />
                    </Center>
                  </VStack>

                  <Stack spacing="13px" mt="30px" display={showLoginFields ? 'block' : 'none'}>
                    <FormControl isInvalid={errors?.email}>
                      <FormLabel htmlFor="email" fontSize="12px" color="#252F40" fontWeight="bold">
                        Email Address
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Please enter your email address"
                        {...register('email', {
                          required: 'This is required',
                          onChange: e => setValue('businessEmailAddress', e.target.value),
                        })}
                        tabIndex={1}
                      />
                      <FormErrorMessage>{errors?.email && errors?.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors?.firstName}>
                      <FormLabel htmlFor="firstName" fontSize="12px" color="#252F40" fontWeight="bold">
                        First Name
                      </FormLabel>
                      <Input
                        id="firstName"
                        type="text"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your first name"
                        {...register('firstName', {
                          required: 'This is required',
                          onChange: e => setValue('ownerName', e.target.value + ' ' + getValues('lastName')),
                        })}
                        tabIndex={2}
                      />
                      <FormErrorMessage>{errors?.firstName && errors?.firstName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.lastName}>
                      <FormLabel htmlFor="lastName" fontSize="12px" color="#252F40" fontWeight="bold">
                        Last Name
                      </FormLabel>
                      <Input
                        id="lastName"
                        type="text"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your last name"
                        {...register('lastName', {
                          required: 'This is required',
                          onChange: e => setValue('ownerName', getValues('firstName') + ' ' + e.target.value),
                        })}
                        tabIndex={3}
                      />
                      <FormErrorMessage>{errors?.lastName && errors?.lastName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.password}>
                      <FormLabel htmlFor="password" fontSize="12px" color="#252F40" fontWeight="bold">
                        Password
                      </FormLabel>
                      <Input
                        id="password"
                        type="password"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your password"
                        {...register('password', {
                          required: 'This is required',
                        })}
                        tabIndex={4}
                      />
                      <FormErrorMessage>{errors?.password && errors?.password?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.companyName}>
                      <FormLabel htmlFor="companyName" fontSize="12px" color="#252F40" fontWeight="bold">
                        Business Name
                      </FormLabel>

                      <Input
                        id="companyName"
                        type="text"
                        fontSize="14px"
                        color="#252F40"
                        disabled={disableLoginFields}
                        placeholder="Enter your business name"
                        {...register('companyName', {
                          required: 'This is required',
                        })}
                        tabIndex={5}
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
                    }}
                  >
                    <Divider
                      orientation="vertical"
                      border="3px solid #345587"
                      backgroundColor="#345587"
                      opacity="1"
                      borderRadius="300px"
                      position="relative"
                      top="calc(98% - 400px);"
                      borderColor="#345587 !important"
                    />
                  </Stack>
                </Flex>
                <Flex
                  alignItems="center"
                  w={{ sm: '100%', md: '60%' }}
                  maxW="800px"
                  sx={{
                    '@media only screen and (max-width: 480px)': {
                      marginTop: '30px !important',
                    },
                  }}
                >
                  <VStack w="100%">
                    <Tabs
                      w={{ sm: '100%', md: '680px' }}
                      onChange={index => setformTabIndex(index)}
                      index={formTabIndex}
                    >
                      <TabList flexDir={{ base: 'column', sm: 'row' }}>
                        <CustomTab isDisabled={formTabIndex !== FORM_TABS.LOCATION_DETAILS}>Location Details</CustomTab>
                        <CustomTab isDisabled={formTabIndex !== FORM_TABS.DOCUMENTS}>Documents</CustomTab>
                        <CustomTab isDisabled={formTabIndex !== FORM_TABS.LICENSE}>License</CustomTab>
                        <CustomTab isDisabled={formTabIndex !== FORM_TABS.CONSTRUCTION_TRADE}>
                          Construction Trade
                        </CustomTab>
                        <CustomTab isDisabled={formTabIndex !== FORM_TABS.MARKETS}>Markets</CustomTab>
                      </TabList>

                      <TabPanels>
                        <TabPanel p={{ sm: 0, md: '1rem' }}>
                          <HStack mt="30px" spacing={{ sm: '0', md: '70px' }} flexDir={{ base: 'column', sm: 'row' }}>
                            <VStack w={{ sm: '100%', md: '50%' }} spacing="20px">
                              <FormControl isInvalid={errors?.ownerName}>
                                <FormLabel htmlFor="ownerName" fontSize="12px" color="#252F40" fontWeight="bold">
                                  Primary Contact
                                </FormLabel>
                                <Input
                                  id="ownerName"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your primary contact"
                                  readOnly={true}
                                  {...register('ownerName', {
                                    required: 'This is required',
                                  })}
                                  tabIndex={6}
                                />
                                <FormErrorMessage>{errors?.ownerName && errors?.ownerName?.message}</FormErrorMessage>
                              </FormControl>

                              <HStack w="100%" spacing="5px">
                                <Box w="80%">
                                  <FormControl isInvalid={errors?.businessPhoneNumber}>
                                    <FormLabel
                                      htmlFor="businessPhoneNumber"
                                      fontSize="12px"
                                      color="#252F40"
                                      fontWeight="bold"
                                    >
                                      Business Phone Number
                                    </FormLabel>
                                    <Input
                                      id="businessPhoneNumber"
                                      type="text"
                                      fontSize="14px"
                                      color="#252F40"
                                      placeholder="Enter Business Phone"
                                      {...register('businessPhoneNumber', {
                                        required: 'This is required',
                                      })}
                                    />
                                    <FormErrorMessage>
                                      {errors?.businessPhoneNumber && errors?.businessPhoneNumber?.message}
                                    </FormErrorMessage>
                                  </FormControl>
                                </Box>
                                <Box w="20%">
                                  <FormControl isInvalid={errors?.businessPhoneNumberExtension}>
                                    <FormLabel
                                      htmlFor="businessPhoneNumberExtension"
                                      fontSize="12px"
                                      color="#252F40"
                                      fontWeight="bold"
                                    >
                                      Ext.
                                    </FormLabel>
                                    <Input
                                      id="businessPhoneNumberExtension"
                                      type="text"
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
                                <FormLabel
                                  htmlFor="businessEmailAddress"
                                  fontSize="12px"
                                  color="#252F40"
                                  fontWeight="bold"
                                >
                                  Primary Email Address
                                </FormLabel>
                                <Input
                                  id="businessEmailAddress"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your primary email address"
                                  readOnly={true}
                                  {...register('businessEmailAddress', {
                                    required: 'This is required',
                                  })}
                                />
                                <FormErrorMessage>
                                  {errors?.businessEmailAddress && errors?.businessEmailAddress?.message}
                                </FormErrorMessage>
                              </FormControl>
                            </VStack>

                            <VStack
                              w={{ sm: '100%', md: '50%' }}
                              spacing="20px"
                              sx={{
                                '@media only screen and (max-width: 480px)': {
                                  marginTop: '20px !important',
                                  width: '100% !important',
                                },
                              }}
                            >
                              <FormControl isInvalid={errors?.secondName}>
                                <FormLabel htmlFor="secondName" fontSize="12px" color="#252F40" fontWeight="bold">
                                  Secondary Contact
                                </FormLabel>
                                <Input
                                  id="secondName"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your secondary contact"
                                  {...register('secondName', {
                                    required: 'This is required',
                                  })}
                                />
                                <FormErrorMessage>{errors?.secondName && errors?.secondName?.message}</FormErrorMessage>
                              </FormControl>

                              <FormControl isInvalid={errors?.secondaryPhone}>
                                <FormLabel
                                  htmlFor="secondPhoneNumber"
                                  fontSize="12px"
                                  color="#252F40"
                                  fontWeight="bold"
                                >
                                  Secondary Phone Number
                                </FormLabel>
                                <Input
                                  id="secondPhoneNumber"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Enter your secondary phone number"
                                  {...register('secondPhoneNumber', {
                                    required: 'This is required',
                                  })}
                                />
                                <FormErrorMessage>
                                  {errors?.secondaryPhone && errors?.secondaryPhone?.message}
                                </FormErrorMessage>
                              </FormControl>

                              <FormControl isInvalid={errors?.secondEmailAddress}>
                                <FormLabel
                                  htmlFor="secondEmailAddress"
                                  fontSize="12px"
                                  color="#252F40"
                                  fontWeight="bold"
                                >
                                  Secondary Email Address
                                </FormLabel>
                                <Input
                                  id="secondEmailAddress"
                                  type="email"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your secondary email address"
                                  {...register('secondEmailAddress', {
                                    required: 'This is required',
                                  })}
                                />
                                <FormErrorMessage>
                                  {errors?.secondEmailAddress && errors?.secondEmailAddress?.message}
                                </FormErrorMessage>
                              </FormControl>
                            </VStack>
                          </HStack>

                          <Tabs index={ssnEinTabIndex} onChange={index => setSsnEinTabIndex(index)} w="100%" mt="10px">
                            <TabList>
                              <Tab>EIN</Tab>
                              <Tab>SSN</Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel>
                                <FormControl isInvalid={errors?.einNumber}>
                                  <Input
                                    as={InputMask}
                                    id="einNumber"
                                    type="text"
                                    fontSize="14px"
                                    color="#252F40"
                                    mask="999-99-9999"
                                    {...register('einNumber', {
                                      required: 'This is required',
                                    })}
                                  />
                                  <FormErrorMessage>{errors?.einNumber && errors?.einNumber?.message}</FormErrorMessage>
                                </FormControl>
                              </TabPanel>
                              <TabPanel>
                                <FormControl isInvalid={errors?.ssnNumber}>
                                  <Input
                                    as={InputMask}
                                    id="ssnNumber"
                                    type="text"
                                    fontSize="14px"
                                    color="#252F40"
                                    mask="999-99-9999"
                                    {...register('ssnNumber', {
                                      required: 'This is required',
                                    })}
                                  />
                                  <FormErrorMessage>{errors?.ssnNumber && errors?.ssnNumber?.message}</FormErrorMessage>
                                </FormControl>
                              </TabPanel>
                            </TabPanels>
                          </Tabs>

                          <VStack w="100%" spacing="20px" mb="20px">
                            <FormControl isInvalid={errors?.streetAddress}>
                              <FormLabel htmlFor="streetAddress" fontSize="12px" color="#252F40" fontWeight="bold">
                                Street Address
                              </FormLabel>
                              <Input
                                id="streetAddress"
                                type="text"
                                fontSize="14px"
                                color="#252F40"
                                placeholder="Please enter your street address"
                                {...register('streetAddress', {
                                  required: 'This is required',
                                })}
                              />
                              <FormErrorMessage>
                                {errors?.streetAddress && errors?.streetAddress?.message}
                              </FormErrorMessage>
                            </FormControl>
                          </VStack>

                          <VStack w="100%">
                            <HStack
                              w="100%"
                              spacing={{ sm: '0', md: '20px' }}
                              flexDir={{ base: 'column', sm: 'row' }}
                              sx={{
                                '@media only screen and (max-width: 480px)': {
                                  marginTop: '20px !important',
                                },
                              }}
                            >
                              <FormControl isInvalid={errors?.city}>
                                <FormLabel htmlFor="city" fontSize="12px" color="#252F40" fontWeight="bold">
                                  City
                                </FormLabel>
                                <Input
                                  id="city"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your city"
                                  {...register('city', {
                                    required: 'This is required',
                                  })}
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
                                <FormLabel htmlFor="state" fontSize="12px" color="#252F40" fontWeight="bold">
                                  State
                                </FormLabel>
                                <Controller
                                  control={control}
                                  name={`state`}
                                  rules={{ required: 'This is required' }}
                                  render={({ field, fieldState }) => (
                                    <>
                                      <Select
                                        {...field}
                                        options={stateSelectOptions}
                                        selected={field.value}
                                        onChange={option => field.onChange(option)}
                                        selectProps={{ isBorderLeft: false }}
                                        className="state-option-vendor-register"
                                        maxMenuHeight={200}
                                        minMenuHeight={200}
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
                              spacing={{ sm: '0', md: '20px' }}
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
                                <FormLabel htmlFor="zipCode" fontSize="12px" color="#252F40" fontWeight="bold">
                                  Zip Code
                                </FormLabel>
                                <Input
                                  id="zipCode"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your zip code"
                                  {...register('zipCode', {
                                    required: 'This is required',
                                  })}
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
                              >
                                <FormLabel htmlFor="capacity" fontSize="12px" color="#252F40" fontWeight="bold">
                                  Capacity
                                </FormLabel>
                                <Input
                                  id="capacity"
                                  type="text"
                                  fontSize="14px"
                                  color="#252F40"
                                  placeholder="Please enter your capacity"
                                  {...register('capacity', {
                                    required: 'This is required',
                                  })}
                                />
                                <FormErrorMessage>{errors?.capacity && errors?.capacity?.message}</FormErrorMessage>
                              </FormControl>
                            </HStack>
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
                      left="23.7%"
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
                        width="154px"
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
                          onClick={doNext}
                          disabled={FORM_TABS.MARKETS === formTabIndex}
                          bgColor="#345587"
                          width="154px"
                          borderRadius="8px"
                          fontSize="14px"
                          borderWidth="1px"
                          borderColor="#345587"
                          fontWeight="bold"
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
