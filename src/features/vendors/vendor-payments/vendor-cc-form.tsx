import { Box, GridItem, FormControl, Input, FormLabel, FormErrorMessage, Grid, Checkbox, Text } from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form';
import Select from 'components/form/react-select'
import { validateWhitespace } from 'api/clients';
import { textInputToPreventText } from 'utils/string-formatters';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import { validateTelePhoneNumber } from 'utils/form-validation';
import NumberFormat from 'react-number-format';
import { CustomRequiredInput } from 'components/input/input';
import { useState } from 'react';
import { t } from 'i18next'
import { PAYMENT_MANAGEMENT } from 'features/user-management/payment-management.i8n';
import { CreditCardFormValues } from './vendor-cc-add-modal';

const cardInputStyle = {
    base: {
        '::placeholder': {
            color: '#a5b2c3',
        },
        fontWeight: 'normal',
        color: '#2D3748',
        fontSize: '14.5px',
    },
};

export interface VendorCCFormProps {
    formReturn: UseFormReturn<CreditCardFormValues>
    stateSelectOptions: any
    isUpdate?: boolean
}

const VendorCCForm = (props: VendorCCFormProps) => {
    const { formReturn, stateSelectOptions, isUpdate } = props;
    const [cardError, setCardError] = useState({
        isEmpty: false,
        message: ''
    });
    const [expDateError, setExpDateError] = useState({
        isEmpty: false,
        message: ''
    });
    const [cvcError, setCvcError] = useState({
        isEmpty: false,
        message: ''
    });

    const isCardError = cardError?.message || cardError?.isEmpty;
    const isExpDateError = expDateError?.message || expDateError?.isEmpty;
    const isCvcError = cvcError?.message || cvcError?.isEmpty;


    const {
        register,
        control,
        formState: { errors },
    } = formReturn;

    return (
        <Box>
            <Grid templateColumns="repeat(3,250px)" rowGap="30px" columnGap="16px">
                <GridItem colSpan={3}>
                    <FormLabel variant="strong-label" color={'gray.500'}>
                        {t(`${PAYMENT_MANAGEMENT}.modal.creditCardInformation`)}
                    </FormLabel>
                </GridItem>
                <GridItem colSpan={3}>
                    <FormControl>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.cardNumber`)}
                        </FormLabel>
                        <Box border={"1px solid"} borderColor={isCardError ? "#E53E3E" : "gray.200"} boxShadow={isCardError ? "0 0 0 1px #E53E3E" : undefined} p={3} borderRadius={"6px"} borderLeft={!isCardError ? "2.5px solid #345EA6" : undefined} w={"516px"}>
                            <CardNumberElement
                                onChange={e => {
                                    if (e?.empty !== cardError.isEmpty) return setCardError({ ...cardError, isEmpty: e.empty });
                                    if (e?.error?.message) {
                                        setCardError({ ...cardError, message: e?.error?.message });
                                    } else {
                                        setCardError({ ...cardError, message: '' });
                                    }
                                }}
                                options={{
                                    showIcon: true,
                                    style: cardInputStyle,
                                }}
                            />
                        </Box>
                        {isCardError && (
                            <Box color={"red.500"} fontSize={"11px"} mt={"0.5rem"}>
                                {cardError?.isEmpty ? "This is required" : cardError?.message}
                            </Box>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.expirationDate`)}
                        </FormLabel>
                        <Box border={"1px solid"} borderColor={isExpDateError ? "#E53E3E" : "gray.200"} boxShadow={isExpDateError ? "0 0 0 1px #E53E3E" : undefined} p={3} borderRadius={"6px"} borderLeft={!isExpDateError ? "2.5px solid #345EA6" : undefined}>
                            <CardExpiryElement
                                onChange={e => {
                                    if (e?.empty !== expDateError.isEmpty) return setExpDateError({ ...expDateError, isEmpty: e.empty });
                                    if (e?.error?.message) {
                                        setExpDateError({ ...expDateError, message: e?.error?.message });
                                    } else {
                                        setExpDateError({ ...expDateError, message: '' });
                                    }
                                }}
                                options={{
                                    style: cardInputStyle,
                                }}
                            />
                        </Box>
                        {isExpDateError && (
                            <Box color={"red.500"} fontSize={"11px"} mt={"0.5rem"}>
                                {expDateError?.isEmpty ? "This is required" : expDateError?.message}
                            </Box>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.cvc`)}
                        </FormLabel>
                        <Box border={"1px solid"} borderColor={isCvcError ? "#E53E3E" : "gray.200"} boxShadow={isCvcError ? "0 0 0 1px #E53E3E" : undefined} p={3} borderRadius={"6px"} borderLeft={!isCvcError ? "2.5px solid #345EA6" : undefined}>
                            <CardCvcElement
                                onChange={e => {
                                    if (e?.empty !== cvcError.isEmpty) return setCvcError({ ...cvcError, isEmpty: e.empty });
                                    if (e?.error?.message) {
                                        setCvcError({ ...cvcError, message: e?.error?.message });
                                    } else {
                                        setCvcError({ ...cvcError, message: '' });
                                    }
                                }}
                                options={{
                                    style: cardInputStyle,
                                }}
                            />
                        </Box>
                        {isCvcError && (
                            <Box color={"red.500"} fontSize={"11px"} mt={"0.5rem"}>
                                {cvcError?.isEmpty ? "This is required" : cvcError?.message}
                            </Box>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem colSpan={3}>
                    <FormLabel variant="strong-label" color={'gray.500'}>
                        {t(`${PAYMENT_MANAGEMENT}.modal.cardHolderInformation`)}
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.firstName}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.firstName`)}
                        </FormLabel>
                        <Input
                            id="firstName"
                            {...register('firstName', {
                                maxLength: { value: 100, message: 'First Name cannot exceed 100 characters.' },
                                required: 'This is required',
                                validate: {
                                    whitespace: validateWhitespace,
                                },
                            })}
                            variant={'required-field'}
                        />
                        {errors.firstName && (
                            <FormErrorMessage>
                                {errors.firstName.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.lastName}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.lastName`)}
                        </FormLabel>
                        <Input
                            id="lastName"
                            {...register('lastName', {
                                maxLength: { value: 100, message: 'Last Name cannot exceed 100 characters.' },
                                required: 'This is required',
                                validate: {
                                    whitespace: validateWhitespace,
                                },
                            })}
                            variant={'required-field'}
                        />
                        {errors.lastName && (
                            <FormErrorMessage>
                                {errors.lastName.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.phone}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.contactNumber`)}
                        </FormLabel>
                        <Controller
                            data-testid="contact-number"
                            control={control}
                            rules={{
                                required: 'This is required',
                                validate: (number: string) => validateTelePhoneNumber(number) ? true : "Invalid Contact Number",
                            }}
                            name="phone"
                            render={({ field, fieldState }) => {
                                return (
                                    <>
                                        <NumberFormat
                                            data-testid="contact-number"
                                            value={field.value}
                                            customInput={CustomRequiredInput}
                                            format="(###) ###-####"
                                            mask="_"
                                            onValueChange={e => {
                                                field.onChange(e.value)
                                            }}
                                        />
                                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                    </>
                                )
                            }}
                        ></Controller>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.email}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.email`)}
                        </FormLabel>
                        <Input
                            id="email"
                            {...register('email', {
                                maxLength: { value: 50, message: 'Email cannot exceed 50 characters.' },
                                required: 'This is required',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Invalid Email Address',
                                },
                            })}
                            variant={'required-field'}
                            type="email"
                        />
                        {errors.email && (
                            <FormErrorMessage>
                                {errors.email.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem colSpan={3}>
                    <FormLabel variant="strong-label" color={'gray.500'}>
                        {t(`${PAYMENT_MANAGEMENT}.modal.billingAddress`)}
                    </FormLabel>
                </GridItem>
                <GridItem colSpan={3}>
                    <FormControl isInvalid={!!errors?.billingAddress?.line1}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.address`)}
                        </FormLabel>
                        <Input
                            id="billingAddress.line1"
                            {...register('billingAddress.line1', {
                                maxLength: { value: 255, message: 'Please use 255 characters only.' },
                                required: 'This is required',
                                validate: {
                                    whitespace: validateWhitespace,
                                },
                            })}
                            variant={'required-field'}
                        />
                        {errors?.billingAddress?.line1 && (
                            <FormErrorMessage>
                                {errors.billingAddress.line1.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.billingAddress?.city}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.city`)}
                        </FormLabel>
                        <Input
                            id="billingAddress.city"
                            {...register('billingAddress.city', {
                                maxLength: { value: 100, message: 'City cannot exceed 100 characters.' },
                                required: 'This is required',
                                validate: {
                                    whitespace: validateWhitespace,
                                },
                            })}
                            variant={'required-field'}
                        />
                        {errors?.billingAddress?.city && (
                            <FormErrorMessage>
                                {errors.billingAddress.city.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.billingAddress?.state}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.state`)}
                        </FormLabel>
                        <Controller
                            control={control}
                            name={`billingAddress.state`}
                            rules={{ required: 'This is required field' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        id="state"
                                        {...field}
                                        options={stateSelectOptions}
                                        size="md"
                                        value={field.value}
                                        selectProps={{ isBorderLeft: true, menuHeight: '235px' }}
                                        onChange={option => field.onChange(option)}
                                    />
                                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                </>
                            )}
                        />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors?.billingAddress?.postalCode}>
                        <FormLabel variant="strong-label" size="md">
                            {t(`${PAYMENT_MANAGEMENT}.modal.zipCode`)}
                        </FormLabel>
                        <Input
                            id="billingAddress.postalCode"
                            {...register('billingAddress.postalCode', {
                                maxLength: { value: 20, message: 'Zip Code cannot exceed 20 characters.' },
                                required: 'This is required',
                                validate: {
                                    whitespace: validateWhitespace,
                                },
                            })}
                            variant={'required-field'}
                            onKeyDown={textInputToPreventText}
                        />
                        {errors?.billingAddress?.postalCode && (
                            <FormErrorMessage>
                                {errors?.billingAddress?.postalCode.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                {isUpdate && <GridItem colSpan={3}>
                    <Controller
                        control={control}
                        name={`isPaymentMethodDefault`}
                        render={({ field }) => (
                            <>
                                <Checkbox
                                    colorScheme="PrimaryCheckBox"
                                    isChecked={field.value}
                                    style={{ background: 'white', border: '#DFDFDF' }}
                                    mr="2px"
                                    size="md"
                                    onChange={value => {
                                        field.onChange(value)
                                    }}
                                >
                                    <Text fontSize="14px" w="full" wordBreak={'break-word'}>
                                        Use this as default payment method
                                    </Text>
                                </Checkbox>
                            </>
                        )}
                    />
                </GridItem>}
            </Grid>
        </Box>
    )
}

export default VendorCCForm
