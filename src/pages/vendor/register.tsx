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
    useMultiStyleConfig, Button, Tab, useToast } from '@chakra-ui/react'
import { useStates } from 'api/pc-projects'
import { parseCreateVendorFormToAPIData, useMarkets, useTrades } from 'api/vendor-details'
import { useVendorRegister } from 'api/vendor-register'
import { ConstructionTradeCard } from 'components/vendor-register/construction-trade-card'
import { DocumentsCard } from 'components/vendor-register/documents-card'
import { LicenseCard } from 'components/vendor-register/license-card'
import { MarketListCard } from 'components/vendor-register/market-list-card'
import { Card } from 'features/login-form-centered/Card'
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from 'react-hook-form'
import InputMask from "react-input-mask"
import Select from 'components/form/react-select'


const CustomTab = React.forwardRef((props: any, ref: any) => {
     
      const tabProps = useTab({ ...props, ref })
      const isSelected = !!tabProps['aria-selected']
  
      const styles = useMultiStyleConfig('Tabs', tabProps)
  
      return (
        <Button {...tabProps} __css={styles.tab} sx={{
            ":hover": {
                color: "#000",
                background: "transparent !important",
                borderBottomColor: "#000"
            },
            borderBottomColor: isSelected ? "#000 !important":"#D9D9D9 !important",
            color: "#000 !important"
        }}>
            <Box 
            as='span' 
            mr='2' 
            fontWeight={isSelected ? "bold":"" }
            fontSize="12px"
            background="transparent"
            >
                {tabProps.children}
            </Box>
        </Button>
      )
})


enum FORM_TABS {
    LOCATION_DETAILS,
    DOCUMENTS,
    LICENSE,
    CONSTRUCTION_TRADE,
    MARKETS
};
export const VendorRegister = () => {

    const [ formTabIndex, setformTabIndex ] = useState<number>(FORM_TABS.LOCATION_DETAILS);
    const [ ssnEinTabIndex, setSsnEinTabIndex ] = useState<number>(0);

    const formReturn = useForm({
        mode: "onChange"
    });
    
    const { markets } = useMarkets();
    const { data: trades } = useTrades();
    const { stateSelectOptions } = useStates();
    const toast = useToast();
    
    const  { mutate: createVendorAccount } = useVendorRegister();

    const { 
        handleSubmit, 
        register,
        formState: { errors, isSubmitting },
        reset,
        control,
        setValue,
        getValues,
        trigger
     } = formReturn;
    
    useEffect( () => {

        if (markets?.length) {
            const tradeFormValues = {
                    markets: markets.map(market => ({
                    market,
                    checked: false,
                }))
            };

            setValue('markets', tradeFormValues.markets)
        }
    
        if (trades?.length) {
            const tradeFormValues =  {
                trades: trades.map(trade => ({
                  trade,
                  checked: false,
                })),
              }
            setValue('trades', tradeFormValues.trades)
        }
    }, [ trades, markets ] );

    const doNext = async () => {
        
        const detailFields = [ "ownerName",
                                "secondName",
                                "businessPhoneNumber",
                                "businessPhoneNumberExtension",
                                "secondPhoneNumber",
                                "businessEmailAddress",
                                "companyName",
                                "streetAddress",
                                "city",
                                "zipCode",
                                "capacity",
                                "einNumber",
                                "ssnNumber",
                                "secondEmailAddress",
                                "secondEmailAddress",
                                "state",
                                "email",
                                "firstName",
                                "lastName",
                                "password",
                                
                             ];

        if ( formTabIndex === FORM_TABS.LOCATION_DETAILS ) {

            if ( await trigger( detailFields ) )
                setformTabIndex( FORM_TABS.DOCUMENTS );

            return null;
        }

        if ( formTabIndex < 4 )
            setformTabIndex( formTabIndex + 1 );
    }

    const doCancel = () => {
        reset();
        setformTabIndex(FORM_TABS.LOCATION_DETAILS);
    }

    const onSubmit = async ( formValues ) => {
        
        const firstName = formValues.firstName;
        const lastName = formValues.lastName;
        const password = formValues.password;
        const email = formValues.email;
        const login = email;
        const streetAddress = formValues.streetAddress;
        const telephoneNumber = formValues.telephoneNumber;
        const state = formValues.state.id;

        console.log( formValues );

        const vendorDetails: any = await parseCreateVendorFormToAPIData( formValues, [] );

        vendorDetails.status = 12;
        vendorDetails.score = 1;
        vendorDetails.userType = 6;
        vendorDetails.state = state;

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
            state: state
        };

        
        
        createVendorAccount( vendorObj );
    }

    
    const validateTrade = trades => {
        const checkedTrades = trades?.filter(t => t.checked)
        if (!(checkedTrades && checkedTrades.length > 0)) {
          return false
        }
        return true
    }
      
    const validateMarket = markets => {
        const checkedMarkets = markets?.filter(t => t.checked)
        if (!(checkedMarkets && checkedMarkets.length > 0)) {
          return false
        }
        return true
    }
    
    const showError = name => {
        toast({
          description: `Atleast one ${name} must be selected`,
          status: 'error',
          isClosable: true,
        })
    }

    const createUserVendorAccount = async ( formValues: any ) => {
        
        onSubmit( formValues );
        
    }
    
    
    return (
        <Box
            bgImg="url(./bg.svg)"
            bgRepeat="no-repeat"
            bgSize="cover"
            minH="100vh"
            py="12"
            px={{ base: '4', lg: '8' }}
            display="flex"
            dir="column"
            alignItems="center"
            maxW="100%"
            overflow="hidden"
        >
            <Box 
                width="100%" 
                mx="auto"
                overflow="hidden"
            >
                <Card
                    borderBottomLeftRadius="0px !important"
                    borderBottomRightRadius="0px !important"
                    bg="#F5F5F5;"
                    py="10px !important"
                    opacity="1"
                    height="auto"
                    minH="90vh"
                    overflow="hidden"
                >
                    <FormProvider {...formReturn}>
                        <form 
                            onSubmit={handleSubmit(createUserVendorAccount)}
                            autoComplete="off"
                        >
                            <HStack spacing="50px" alignItems="flex-start">
                                <Box width="30%">
                                    <VStack alignItems="baseline">
                                        <Box w="105px" h="140px">
                                            <Image src="./logo-reg-vendor.svg" />
                                            <Image src="./WhiteOaks.svg" mt="10px" />
                                        </Box>
                                        <Box>
                                            <Heading 
                                                fontSize="26px"
                                                color="#345587"
                                            >Vendor Registration</Heading>
                                            <Text 
                                                fontSize="14px" 
                                                color="#8392AB"
                                                mb="10px"
                                            >Please fill the below form for vendor registration.</Text>
                                        </Box>
                                        <Center width='100%'>
                                            <Divider 
                                                orientation='horizontal'
                                                border="1px solid #C5C5C5"
                                                backgroundColor="#C5C5C5"
                                                borderColor="#C5C5C5 !important" 
                                                w="100%"
                                                opacity="1"
                                            />
                                        </Center>
                                    </VStack>
                                
                                    
                                
                                    <Stack spacing="13px" mt="30px">
                                        
                                            <FormControl isInvalid={errors?.email}>
                                                <FormLabel 
                                                    htmlFor="email"
                                                    fontSize="12px"
                                                    color="#252F40"
                                                    fontWeight="bold"
                                                >Email Address</FormLabel>
                                                <Input 
                                                    id="email"
                                                    type="email"
                                                    fontSize="14px"
                                                    color="#252F40"
                                                    placeholder="Please enter your email address"
                                                    {
                                                        ...register("email", {
                                                            required: "This is required"
                                                        })
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {errors?.email && errors?.email?.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                            <FormControl isInvalid={errors?.firstName}>
                                                <FormLabel 
                                                    htmlFor="firstName"
                                                    fontSize="12px"
                                                    color="#252F40"
                                                    fontWeight="bold"
                                                >First Name</FormLabel>
                                                <Input 
                                                    id="firstName"
                                                    type="text"
                                                    fontSize="14px"
                                                    color="#252F40"
                                                    placeholder="Enter your first name"
                                                    {
                                                        ...register("firstName", {
                                                            required: "This is required"
                                                        })
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {errors?.firstName && errors?.firstName?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={errors?.lastName}>
                                                <FormLabel 
                                                    htmlFor="lastName"
                                                    fontSize="12px"
                                                    color="#252F40"
                                                    fontWeight="bold"
                                                >Last Name</FormLabel>
                                                <Input 
                                                    id="lastName"
                                                    type="text"
                                                    fontSize="14px"
                                                    color="#252F40"
                                                    placeholder="Enter your last name"
                                                    {
                                                        ...register("lastName", {
                                                            required: "This is required"
                                                        })
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {errors?.lastName && errors?.lastName?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={errors?.password}>
                                                <FormLabel 
                                                    htmlFor="password"
                                                    fontSize="12px"
                                                    color="#252F40"
                                                    fontWeight="bold"
                                                >Password</FormLabel>
                                                <Input 
                                                    id="password"
                                                    type="password"
                                                    fontSize="14px"
                                                    color="#252F40"
                                                    placeholder="Enter your password"
                                                    {
                                                        ...register("password", {
                                                            required: "This is required"
                                                        })
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {errors?.password && errors?.password?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={errors?.businessName}>
                                                <FormLabel 
                                                    htmlFor="companyName"
                                                    fontSize="12px"
                                                    color="#252F40"
                                                    fontWeight="bold"
                                                >Business Name</FormLabel>
                                                <Input 
                                                    id="companyName"
                                                    type="text"
                                                    fontSize="14px"
                                                    color="#252F40"
                                                    placeholder="Enter your business name"
                                                    {
                                                        ...register("companyName", {
                                                            required: "This is required"
                                                        })
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {errors?.companyName && errors?.companyName?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                        
                                    </Stack>
                                </Box>
                                <Flex>   
                                    <Stack direction='row' h='557px' p={4}>
                                        <Divider 
                                            orientation='vertical' 
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
                                <Flex alignItems="center" w="60%" maxW="800px">
                                    <VStack w="100%">
                                        <Tabs w="680px" onChange={ index => setformTabIndex(index) } index={formTabIndex}>
                                            
                                            <TabList>
                                                    <CustomTab>Location Details</CustomTab>
                                                    <CustomTab>Documents</CustomTab>
                                                    <CustomTab>License</CustomTab>
                                                    <CustomTab>Construction Trade</CustomTab>
                                                    <CustomTab>Markets</CustomTab>
                                            </TabList>
                                            
                                            
                                            <TabPanels>
                                                <TabPanel>
                                                    <HStack mt="30px" spacing="70px">
                                                        <VStack w="50%" spacing="20px">
                                                            <FormControl isInvalid={errors?.ownerName}>
                                                                <FormLabel 
                                                                    htmlFor="ownerName"
                                                                    fontSize="12px"
                                                                    color="#252F40"
                                                                    fontWeight="bold"
                                                                >Primary Contact</FormLabel>
                                                                <Input 
                                                                    id="ownerName"
                                                                    type="text"
                                                                    fontSize="14px"
                                                                    color="#252F40"
                                                                    placeholder="Please enter your primary contact"
                                                                    {
                                                                        ...register("ownerName", {
                                                                            required: "This is required"
                                                                        })
                                                                    }
                                                                />
                                                                <FormErrorMessage>
                                                                    {errors?.ownerName && errors?.ownerName?.message}
                                                                </FormErrorMessage>
                                                            </FormControl>
                                                            
                                                            <HStack w="100%" spacing="5px">
                                                                <Box w="80%">
                                                                    <FormControl isInvalid={errors?.businessPhoneNumber}>
                                                                        <FormLabel 
                                                                            htmlFor="businessPhoneNumber"
                                                                            fontSize="12px"
                                                                            color="#252F40"
                                                                            fontWeight="bold"
                                                                        >Business Phone Number</FormLabel>
                                                                        <Input 
                                                                            id="businessPhoneNumber"
                                                                            type="text"
                                                                            fontSize="14px"
                                                                            color="#252F40"
                                                                            placeholder="Enter Business Phone"
                                                                            {
                                                                                ...register("businessPhoneNumber", {
                                                                                    required: "This is required"
                                                                                })
                                                                            }
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
                                                                        >Ext.</FormLabel>
                                                                        <Input 
                                                                            id="businessPhoneNumberExtension"
                                                                            type="text"
                                                                            fontSize="14px"
                                                                            color="#252F40"
                                                                            placeholder=""
                                                                            {
                                                                                ...register("businessPhoneNumberExtension", {
                                                                                    
                                                                                })
                                                                            }
                                                                        />
                                                                        <FormErrorMessage>
                                                                            {errors?.businessPhoneNumberExt && errors?.businessPhoneNumberExt?.message}
                                                                        </FormErrorMessage>
                                                                    </FormControl>    
                                                                </Box>
                                                                
                                                            </HStack>
                                                            

                                                            <FormControl isInvalid={errors?.primaryEmailAddress}>
                                                                <FormLabel 
                                                                    htmlFor="businessEmailAddress"
                                                                    fontSize="12px"
                                                                    color="#252F40"
                                                                    fontWeight="bold"
                                                                >Primary Email Address</FormLabel>
                                                                <Input 
                                                                    id="businessEmailAddress"
                                                                    type="text"
                                                                    fontSize="14px"
                                                                    color="#252F40"
                                                                    placeholder="Please enter your primary email address"
                                                                    {
                                                                        ...register("businessEmailAddress", {
                                                                            required: "This is required"
                                                                        })
                                                                    }
                                                                />
                                                                <FormErrorMessage>
                                                                    {errors?.businessEmailAddress && errors?.businessEmailAddress?.message}
                                                                </FormErrorMessage>
                                                            </FormControl>

                                                        </VStack>

                                                        <VStack w="50%" spacing="20px">

                                                            

                                                                <FormControl isInvalid={errors?.secondName}>
                                                                    <FormLabel 
                                                                        htmlFor="secondName"
                                                                        fontSize="12px"
                                                                        color="#252F40"
                                                                        fontWeight="bold"
                                                                    >Secondary Contact</FormLabel>
                                                                    <Input 
                                                                        id="secondName"
                                                                        type="text"
                                                                        fontSize="14px"
                                                                        color="#252F40"
                                                                        placeholder="Please enter your secondary contact"
                                                                        {
                                                                            ...register("secondName", {
                                                                                required: "This is required"
                                                                            })
                                                                        }
                                                                    />
                                                                    <FormErrorMessage>
                                                                        {errors?.secondName && errors?.secondName?.message}
                                                                    </FormErrorMessage>
                                                                </FormControl>

                                                                <FormControl isInvalid={errors?.secondaryPhone}>
                                                                    <FormLabel 
                                                                        htmlFor="secondPhoneNumber"
                                                                        fontSize="12px"
                                                                        color="#252F40"
                                                                        fontWeight="bold"
                                                                    >Secondary Phone Number</FormLabel>
                                                                    <Input 
                                                                        id="secondPhoneNumber"
                                                                        type="text"
                                                                        fontSize="14px"
                                                                        color="#252F40"
                                                                        placeholder="Enter your secondary phone number"
                                                                        {
                                                                            ...register("secondPhoneNumber", {
                                                                                required: "This is required"
                                                                            })
                                                                        }
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
                                                                    >Secondary Email Address</FormLabel>
                                                                    <Input 
                                                                        id="secondEmailAddress"
                                                                        type="email"
                                                                        fontSize="14px"
                                                                        color="#252F40"
                                                                        placeholder="Please enter your secondary email address"
                                                                        {
                                                                            ...register("secondEmailAddress", {
                                                                                required: "This is required"
                                                                            })
                                                                        }
                                                                    />
                                                                    <FormErrorMessage>
                                                                        {errors?.secondEmailAddress && errors?.secondEmailAddress?.message}
                                                                    </FormErrorMessage>
                                                                </FormControl>

                                                        </VStack>
                                                    </HStack>
                                                    <VStack w="100%" spacing="20px" mt="20px">
                                                        
                                                        <FormControl isInvalid={errors?.streetAddress}>
                                                            <FormLabel 
                                                                htmlFor="streetAddress"
                                                                fontSize="12px"
                                                                color="#252F40"
                                                                fontWeight="bold"
                                                            >Street Address</FormLabel>
                                                            <Input 
                                                                id="streetAddress"
                                                                type="text"
                                                                fontSize="14px"
                                                                color="#252F40"
                                                                placeholder="Please enter your street address"
                                                                {
                                                                    ...register("streetAddress", {
                                                                    required: "This is required"
                                                                    })
                                                                }
                                                            />
                                                            <FormErrorMessage>
                                                                {errors?.streetAddress && errors?.streetAddress?.message}
                                                            </FormErrorMessage>
                                                        </FormControl>

                                                        <Tabs index={ssnEinTabIndex} onChange={ index => setSsnEinTabIndex( index ) } w="100%">
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
                                                                            mask="99-9999999"
                                                                            {
                                                                                ...register("einNumber", {
                                                                                required: "This is required"
                                                                                })
                                                                            }
                                                                        />
                                                                        <FormErrorMessage>
                                                                            {errors?.einNumber && errors?.einNumber?.message}
                                                                        </FormErrorMessage>
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
                                                                            {
                                                                                ...register("ssnNumber", {
                                                                                required: "This is required"
                                                                                })
                                                                            }
                                                                        />
                                                                        <FormErrorMessage>
                                                                            {errors?.ssnNumber && errors?.ssnNumber?.message}
                                                                        </FormErrorMessage>
                                                                    </FormControl>
                                                                </TabPanel>
                                                            </TabPanels>
                                                        </Tabs>

                                                    </VStack>
                                                    
                                                    <VStack w="100%">
                                                        <HStack w="100%" spacing="20px">
                                                            <FormControl isInvalid={errors?.city}>
                                                                    <FormLabel 
                                                                        htmlFor="city"
                                                                        fontSize="12px"
                                                                        color="#252F40"
                                                                        fontWeight="bold"
                                                                    >City</FormLabel>
                                                                    <Input 
                                                                        id="city"
                                                                        type="text"
                                                                        fontSize="14px"
                                                                        color="#252F40"
                                                                        placeholder="Please enter your city"
                                                                        {
                                                                            ...register("city", {
                                                                                required: "This is required"
                                                                            })
                                                                        }
                                                                    />
                                                                    <FormErrorMessage>
                                                                        {errors?.city && errors?.city?.message}
                                                                    </FormErrorMessage>
                                                                </FormControl>
                                                                <FormControl isInvalid={!!errors?.state}>
                                                                    <FormLabel 
                                                                            htmlFor="state"
                                                                            fontSize="12px"
                                                                            color="#252F40"
                                                                            fontWeight="bold"
                                                                        >State</FormLabel>
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
                                                                                selectProps={{ isBorderLeft: true }}
                                                                            />
                                                                            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                                                        </>
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                               
                                                        </HStack>
                                                        <HStack w="100%" spacing="20px">
                                                                <FormControl isInvalid={errors?.zipCode}>
                                                                    <FormLabel 
                                                                        htmlFor="zipCode"
                                                                        fontSize="12px"
                                                                        color="#252F40"
                                                                        fontWeight="bold"
                                                                    >Zip Code</FormLabel>
                                                                    <Input 
                                                                        id="zipCode"
                                                                        type="text"
                                                                        fontSize="14px"
                                                                        color="#252F40"
                                                                        placeholder="Please enter your zip code"
                                                                        {
                                                                            ...register("zipCode", {
                                                                                required: "This is required"
                                                                            })
                                                                        }
                                                                    />
                                                                    <FormErrorMessage>
                                                                        {errors?.city && errors?.city?.message}
                                                                    </FormErrorMessage>
                                                                </FormControl>
                                                                <FormControl isInvalid={errors?.capacity}>
                                                                    <FormLabel 
                                                                        htmlFor="capacity"
                                                                        fontSize="12px"
                                                                        color="#252F40"
                                                                        fontWeight="bold"
                                                                    >Capacity</FormLabel>
                                                                    <Input 
                                                                        id="capacity"
                                                                        type="text"
                                                                        fontSize="14px"
                                                                        color="#252F40"
                                                                        placeholder="Please enter your capacity"
                                                                        {
                                                                            ...register("capacity", {
                                                                                required: "This is required"
                                                                            })
                                                                        }
                                                                    />
                                                                    <FormErrorMessage>
                                                                        {errors?.capacity && errors?.city?.capacity}
                                                                    </FormErrorMessage>
                                                                </FormControl>
                                                        </HStack>
                                                    </VStack>
                                                </TabPanel>
                                                <TabPanel>

                                                    <DocumentsCard isActive={ formTabIndex === FORM_TABS.DOCUMENTS } />
                                                
                                                </TabPanel>
                                                <TabPanel>
                                                    <LicenseCard isActive={ formTabIndex === FORM_TABS.LICENSE } />
                                                </TabPanel>
                                                <TabPanel>
                                                    <ConstructionTradeCard isActive={ formTabIndex === FORM_TABS.CONSTRUCTION_TRADE } />
                                                </TabPanel>
                                                <TabPanel>
                                                    <MarketListCard isActive={ formTabIndex === FORM_TABS.MARKETS } />
                                                </TabPanel>
                                            </TabPanels>
                                        </Tabs>
                                        <HStack 
                                            spacing="16px"
                                            position="relative"
                                            left="16.7%"
                                            marginTop="6%"
                                        >
                                            <Button 
                                                onClick={ doCancel }
                                                bgColor="#FFFFFF"
                                                width="154px"
                                                borderRadius="8px"
                                                fontSize="14px"
                                                borderWidth="1px"
                                                borderColor="#345587"
                                                fontWeight="bold"
                                                color="#345587"
                                                
                                            >Cancel</Button>
                                            { FORM_TABS.MARKETS !== formTabIndex && <Button 
                                                onClick={ doNext } 
                                                disabled={ FORM_TABS.MARKETS === formTabIndex }
                                                bgColor="#345587"
                                                width="154px"
                                                borderRadius="8px"
                                                fontSize="14px"
                                                borderWidth="1px"
                                                borderColor="#345587"
                                                fontWeight="bold"
                                            >Next</Button> }
                                            { FORM_TABS.MARKETS === formTabIndex && <Button 
                                                bgColor="#345587"
                                                width="154px"
                                                borderRadius="8px"
                                                fontSize="14px"
                                                borderWidth="1px"
                                                borderColor="#345587"
                                                fontWeight="bold"
                                                type="submit"
                                            >Create Account</Button> }
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
