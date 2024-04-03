import { Box, FormErrorMessage, Grid, GridItem, FormLabel, FormControl, Input, HStack, Checkbox, Flex, VStack, useDisclosure, Button, Image, IconButton } from '@chakra-ui/react';
import { CustomRequiredInput } from 'components/input/input';
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format'
import { preventNumber, VendorAccountsFormValues, VendorProfile } from 'types/vendor.types'
import { validateTelePhoneNumber } from 'utils/form-validation';
import ReactSelect from 'components/form/react-select';
import { useUserRolesSelector } from 'utils/redux-common-selectors';
import { AccountingType, DOCUMENTS_TYPES } from 'api/vendor-details';
import { dateFormatNew, datePickerFormat } from 'utils/date-time-utils';
import ChooseFileField from 'components/choose-file/choose-file';
import { useEffect, useRef, useState } from 'react';
import { downloadDocument } from 'features/vendor-profile/documents-card';
import { SaveChangedFieldAlert } from 'features/vendor-profile/save-change-field';
import { AdminPortalVerifyDocument, VendorPortalVerifyDocument } from 'features/vendor-profile/verify-documents';
import { useDeleteDocument } from 'api/vendor-projects';
import { imgUtility } from 'utils/file-utils';
import { BiAddToQueue, BiTrash } from 'react-icons/bi';
import { FormInput } from 'components/react-hook-form-fields/input';
import SignatureModal from 'features/vendor/vendor-work-order/lien-waiver/signature-modal';
import { ConfirmationBox } from 'components/Confirmation';



const VendorACHForm: React.FC<{ vendorProfileData: VendorProfile, formReturn: UseFormReturn<VendorAccountsFormValues>, isActive, stateSelectOptions: any, isReadOnly: boolean }> = ({ vendorProfileData, formReturn, stateSelectOptions, isReadOnly }) => {
    const { t } = useTranslation();
    const {
        register,
        control,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        watch
    } = formReturn;
    const formValues = useWatch({ control })
    const sigRef = useRef<HTMLImageElement>(null)

    const watchVoidCheckDate = watch('bankVoidedCheckDate')
    const watchVoidCheckFile = watch('voidedCheckFile')

    const { isAdmin, isVendor, isVendorManager } = useUserRolesSelector();
    const adminRole = isAdmin || isVendorManager;
    const validateAccountType = AccountingType?.filter(acct => formValues[acct.key]);
    const isVoidedCheckChange = watchVoidCheckDate !== datePickerFormat(vendorProfileData?.bankVoidedCheckDate) || watchVoidCheckFile

    return (
        <Box>
            <Grid templateColumns="repeat(3,250px)" rowGap="30px" columnGap="16px">
                <GridItem colSpan={3}>
                    <FormLabel variant="strong-label" color={'gray.500'}>
                        Bank Details
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankName}>
                        <FormLabel variant="strong-label" size="md">
                            {t('bankName')}
                        </FormLabel>
                        <Input
                            type="text"
                            id="bankName"
                            variant={'required-field'}
                            {...register('bankName', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}
                            size="md"
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankName', title);
                                if (title?.length > 255) {
                                    setError('bankName', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankName');
                                }
                            }}
                        />
                        {!!errors.bankName && (
                            <FormErrorMessage> {errors?.bankName?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankPrimaryContact}>
                        <FormLabel variant="strong-label" size="md">
                            {t('bankPrimaryContact')}
                        </FormLabel>
                        <Input
                            type="text"
                            id="bankPrimaryContact"
                            variant={'required-field'}
                            {...register('bankPrimaryContact', {
                                maxLength: { value: 46, message: 'Character limit reached (maximum 45 characters)' },
                                required: 'This is required',
                            })}
                            size="md"
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankPrimaryContact', title);
                                if (title?.length > 255) {
                                    setError('bankPrimaryContact', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankPrimaryContact');
                                }
                            }}
                        />
                        {!!errors.bankPrimaryContact && (
                            <FormErrorMessage> {errors?.bankPrimaryContact?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem></GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankEmail}>
                        <FormLabel variant="strong-label" size="md">
                            {t('bankEmail')}
                        </FormLabel>
                        <Input
                            type="email"
                            {...register('bankEmail', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}
                            variant={'required-field'}
                            size="md"
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankEmail', title);
                                if (title?.length > 255) {
                                    setError('bankEmail', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankEmail');
                                }
                            }}
                        />
                        {!!errors.bankEmail && (
                            <FormErrorMessage> {errors?.bankEmail?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankPhoneNumber} h="70px">
                        <FormLabel variant="strong-label" size="md" noOfLines={1}>
                            {t('bankPhoneNumber')}
                        </FormLabel>
                        <Controller
                            control={control}
                            rules={{
                                required: 'This is required',
                                validate: (number: string) => validateTelePhoneNumber(number),
                            }}
                            name="bankPhoneNumber"
                            render={({ field, fieldState }) => {
                                return (
                                    <>
                                        <NumberFormat
                                            data-testid="bankPhoneNumber"
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
                        />
                    </FormControl>
                </GridItem>
                <GridItem></GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankAddress}>
                        <FormLabel variant="strong-label" size="md">
                            {t('bankAddress')}
                        </FormLabel>
                        <Input
                            type="text"
                            {...register('bankAddress', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}

                            variant={'required-field'}
                            size="md"
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankAddress', title);
                                if (title?.length > 255) {
                                    setError('bankAddress', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankAddress');
                                }
                            }}
                        />
                        {!!errors.bankAddress && (
                            <FormErrorMessage> {errors?.bankAddress?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankCity}>
                        <FormLabel variant="strong-label" size="md">
                            {t('city')}
                        </FormLabel>
                        <Input
                            type="text"
                            {...register('bankCity', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}

                            variant={'required-field'}
                            size="md"
                            onKeyPress={preventNumber}
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankCity', title);
                                if (title?.length > 255) {
                                    setError('bankCity', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankCity');
                                }
                            }}

                        />
                        {!!errors.bankCity && (
                            <FormErrorMessage> {errors?.bankCity?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankState}>
                        <FormLabel variant="strong-label" size="md">
                            {t('state')}
                        </FormLabel>
                        <Controller
                            control={control}
                            name="bankState"
                            rules={{ required: 'This is required' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <ReactSelect
                                        classNamePrefix={'stateSelectOptions'}
                                        menuPosition="fixed"
                                        options={stateSelectOptions}
                                        {...field}
                                        selectProps={{ isBorderLeft: true, menuHeight: '180px' }}
                                    />
                                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                                </>
                            )}
                        />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankZipCode}>
                        <FormLabel variant="strong-label" size="md">
                            {t('zip')}
                        </FormLabel>
                        <Input
                            type="number"
                            {...register('bankZipCode', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}

                            variant={'required-field'}
                            size="md"
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankZipCode', title);
                                if (title?.length > 255) {
                                    setError('bankZipCode', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankZipCode');
                                }
                            }}
                        />
                        {!!errors.bankZipCode && (
                            <FormErrorMessage> {errors?.bankZipCode?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem></GridItem>
                <GridItem></GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankRoutingNo}>
                        <FormLabel variant="strong-label" size="md">
                            {t('bankRoutingNo')}
                        </FormLabel>
                        <Input
                            type="number"
                            {...register('bankRoutingNo', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}

                            variant={'required-field'}
                            size="md"


                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankRoutingNo', title);
                                if (title?.length > 255) {
                                    setError('bankRoutingNo', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankRoutingNo');
                                }
                            }}
                        />
                        {!!errors.bankRoutingNo && (
                            <FormErrorMessage> {errors?.bankRoutingNo?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankAccountingNo}>
                        <FormLabel variant="strong-label" size="md">
                            {t('bankAccountingNo')}
                        </FormLabel>
                        <Input
                            type="number"
                            {...register('bankAccountingNo', {
                                maxLength: { value: 256, message: 'Character limit reached (maximum 255 characters)' },
                                required: 'This is required',
                            })}
                            variant={'required-field'}
                            size="md"
                            onChange={e => {
                                const title = e?.target.value;
                                setValue('bankAccountingNo', title);
                                if (title?.length > 255) {
                                    setError('bankAccountingNo', {
                                        type: 'maxLength',
                                        message: 'Please use 255 characters only.',
                                    });
                                } else {
                                    clearErrors('bankAccountingNo');
                                }
                            }}
                        />
                        {!!errors.bankAccountingNo && (
                            <FormErrorMessage> {errors?.bankAccountingNo?.message} </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem />
                <GridItem />
                <GridItem colSpan={3}>
                    <HStack alignItems="start" fontSize="14px" fontWeight={500} color="gray.600">
                        <FormLabel variant="strong-label" size="md" w="150px">
                            {t('accountingType')}
                        </FormLabel>
                        <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankChecking?.message && !validateAccountType?.length}>
                            <HStack h="25px" spacing="16px">
                                {AccountingType.map(account => {
                                    return (
                                        <Controller
                                            control={control}
                                            // @ts-ignore
                                            name={account.key as string}
                                            rules={{
                                                required: !validateAccountType?.length && 'This is required',
                                            }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <div data-testid="payment_checkbox_check">
                                                        <Checkbox
                                                            colorScheme="brand"
                                                            isChecked={field.value as boolean}
                                                            onChange={event => {
                                                                const isChecked = event.target.checked
                                                                field.onChange(isChecked)
                                                            }}
                                                            data-testid={account?.value?.toLowerCase() + "-checkbox"}
                                                            mr="2px"
                                                        >
                                                            {t(account?.value)}
                                                        </Checkbox>
                                                    </div>
                                                </>
                                            )}
                                        />
                                    )
                                })}
                            </HStack>
                            <FormErrorMessage pos="absolute">{errors.bankChecking?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack>
                </GridItem>
                <GridItem colSpan={3}>
                    <VoidedCheckFields
                        formReturn={formReturn}
                        vendorProfileData={vendorProfileData}
                        isVendor={isVendor}
                        adminRole={adminRole}
                        isVoidedCheckChange={isVoidedCheckChange}
                        isReadOnly={isReadOnly}
                    />
                </GridItem>
                <GridItem colSpan={2}>
                    <SignatureFields
                        vendorProfileData={vendorProfileData}
                        sigRef={sigRef}
                        formReturn={formReturn}
                        adminRole={adminRole}
                        isReadOnly={isReadOnly}
                    />
                </GridItem>
            </Grid>
        </Box>
    )
}

const VoidedCheckFields = ({ formReturn, vendorProfileData, isVendor, adminRole, isVoidedCheckChange, isReadOnly }) => {
    const voidedCheck = vendorProfileData?.voidedDocumentLink;
    const {
        formState: { errors },
        setValue,
        register,
        control,
        getValues,
    } = formReturn
    const { t } = useTranslation()
    const documents = getValues()
    const showSaveChangeAlert = isVoidedCheckChange && adminRole && vendorProfileData?.id

    return (
        <HStack
            flexDir={{ base: 'column', sm: 'row' }}
            spacing="16px"
            alignItems="flex-start"
            marginTop={{ base: '20px', md: '0' }}
        >
            <Flex w="215px">
                <Box>
                    <FormControl isDisabled={isReadOnly} isInvalid={!!errors.bankVoidedCheckDate}>
                        <FormLabel variant="strong-label" size="md" color="#2D3748">
                            {t('voidedCheckFile')}
                        </FormLabel>
                        <Input
                            variant={'required-field'}
                            w="215px"
                            {...register('bankVoidedCheckDate', {
                                required: 'This is required',
                                onChange: e => {
                                    setValue('bankVoidedCheckDate', e.target.value)
                                    setValue('bankVoidedCheckStatus', null)
                                },
                            })}
                            type="date"
                            data-testid="bankVoidedCheckDate"
                        />
                        <FormErrorMessage>{errors.bankVoidedCheckDate && errors.bankVoidedCheckDate.message}</FormErrorMessage>
                    </FormControl>
                </Box>
            </Flex>
            <HStack
                sx={{
                    '@media screen and (max-width: 480px)': {
                        ms: '0 !important',
                        mt: '20px !important',
                    },
                }}
            >
                <FormControl w="215px" isDisabled={isReadOnly} isInvalid={!!errors.voidedCheckFile?.message}>
                    <FormLabel variant="strong-label" size="md" color="#2D3748">
                        {t('fileUpload')}
                    </FormLabel>
                    <Controller
                        name="voidedCheckFile"
                        control={control}
                        rules={{
                            required: voidedCheck ? false : 'This is required',
                        }}
                        render={({ field, fieldState }) => {
                            return (
                                <VStack alignItems="baseline">
                                    <Box>
                                        <ChooseFileField
                                            isRequired={voidedCheck ? false : true}
                                            disabled={isReadOnly}
                                            testId="voidedCheckFile"
                                            name={field.name}
                                            value={field.value?.name ? field.value?.name : t('chooseFile')}
                                            isError={!!fieldState.error?.message}
                                            onChange={(file: any) => {
                                                if (file) {
                                                    setValue('bankVoidedCheckStatus', null)
                                                }

                                                field.onChange(file)
                                            }}
                                            onClear={() => {
                                                setValue(field.name, undefined)
                                            }}
                                        ></ChooseFileField>

                                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                                    </Box>

                                    <Box overflow="hidden" top={16} h="18px">
                                        {documents?.voidedCheckUrl &&
                                            downloadDocument(documents?.voidedCheckUrl, t('voidedCheck'), 'voidedCheckLink')}
                                    </Box>
                                </VStack>
                            )
                        }}
                    />
                </FormControl>
                {showSaveChangeAlert ? (
                    <SaveChangedFieldAlert />
                ) : (
                    <>
                        {adminRole && (
                            <AdminPortalVerifyDocument
                                vendor={vendorProfileData as any}
                                fieldName="bankVoidedCheckStatus"
                                registerToFormField={register}
                            />
                        )}
                        {isVendor && (
                            <VendorPortalVerifyDocument vendor={vendorProfileData as any} fieldName="bankVoidedCheckStatus" />
                        )}
                    </>
                )}
            </HStack>
        </HStack>
    )
}

const SignatureFields = ({ vendorProfileData, formReturn, adminRole, sigRef, isReadOnly }) => {
    const {
        formState: { errors },
        setValue,
        register,
        control,
        watch,
    } = formReturn
    const { mutate: deleteSignature } = useDeleteDocument()
    const watchOwnersSignature = watch('ownersSignature')
    const signatureDocument = vendorProfileData?.documents?.find(
        (d: any) => d.documentTypelabel === DOCUMENTS_TYPES.OWNERS_SIGNATURE.value,
    )
    const {
        isOpen: isDeleteConfirmationModalOpen,
        onClose: onDeleteConfirmationModalClose,
        onOpen: onDeleteConfirmationModalOpen,
    } = useDisclosure()

    useEffect(() => {
        if (watchOwnersSignature) {
            setOwnersSignature(watchOwnersSignature)
        }
    }, [watchOwnersSignature])

    const [ownersSignature, setOwnersSignature] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [openSignature, setOpenSignature] = useState(false)
    const formValues = useWatch({ control })
    const { t } = useTranslation()

    const convertSignatureTextToImage = value => {
        const uri = imgUtility.generateTextToImage(canvasRef, value)
        setValue('ownersSignature', {
            documentType: DOCUMENTS_TYPES?.OWNERS_SIGNATURE?.id,
            fileObject: uri?.split(',')[1],
            fileObjectContentType: 'image/png',
            fileType: 'Owners-Signature.png',
        })
        setOwnersSignature(uri)
    }

    const onSignatureChange = value => {
        convertSignatureTextToImage(value)
        setValue('bankDateSignature', dateFormatNew(new Date().toISOString().split('T')[0]), { shouldValidate: true })
    }
    const onRemoveSignature = () => {
        onDeleteConfirmationModalClose()
        setOwnersSignature('')
        setValue('ownersSignature', null)
        setValue('bankDateSignature', null)
        if (signatureDocument?.id) {
            deleteSignature(signatureDocument?.id)
        }
    }

    return (
        <HStack gap="20px" alignItems={'start'}>
            <FormControl isDisabled={isReadOnly} isInvalid={!ownersSignature}>
                <FormLabel fontWeight={500} fontSize="14px" color="gray.700">
                    {t('ownersSignature')}
                </FormLabel>
                <Button
                    disabled={isReadOnly}
                    pos="relative"
                    border={'1px solid'}
                    borderColor="gray.200"
                    borderRadius="6px"
                    bg="white"
                    height={'40px'}
                    //borderLeftWidth={'2.5px'}
                    //borderLeftColor="#345EA6"
                    alignItems="center"
                    px={4}
                    ml={0}
                    justifyContent="left"
                    variant="ghost"
                    w="100%"
                    _hover={{ bg: 'white' }}
                    _active={{ bg: 'white' }}
                    _disabled={{
                        bg: 'gray.100',
                        _hover: { bg: 'gray.100' },
                        _active: { bg: 'gray.100' },
                    }}
                    onClick={() => {
                        setOpenSignature(true)
                    }}
                >
                    <canvas hidden ref={canvasRef} height={'64px'} width={'1000px'}></canvas>
                    <Image
                        data-testid="ownersSignature"
                        hidden={!ownersSignature}
                        maxW={'100%'}
                        src={ownersSignature}
                        {...register('ownersSignature', {
                            required: 'This is required',
                        })}
                        variant={'required-field'}
                        ref={sigRef}
                    />
                    {!adminRole && (
                        <HStack pos={'absolute'} right="10px" top="11px" spacing={3}>
                            <IconButton
                                aria-label="open-signature"
                                variant="ghost"
                                minW="auto"
                                height="auto"
                                _hover={{ bg: 'inherit' }}
                                disabled={adminRole}
                                data-testid="openSignature"
                            >
                                <BiAddToQueue color="#A0AEC0" />
                            </IconButton>
                            {ownersSignature && (
                                <IconButton
                                    aria-label="open-signature"
                                    variant="ghost"
                                    minW="auto"
                                    height="auto"
                                    _hover={{ bg: 'inherit' }}
                                    disabled={adminRole}
                                    data-testid="removeSignature"
                                    onClick={e => {
                                        onDeleteConfirmationModalOpen()
                                        e.stopPropagation()
                                    }}
                                >
                                    <BiTrash className="mr-1" color="#A0AEC0" />
                                </IconButton>
                            )}
                        </HStack>
                    )}
                </Button>
                {errors?.ownersSignature?.message && <FormErrorMessage>This is required field</FormErrorMessage>}
            </FormControl>
            <FormControl isDisabled={isReadOnly}>
                <FormInput
                    disabled={isReadOnly}
                    errorMessage={errors?.bankDateSignature?.message}
                    label={t('bankDateSignature')}
                    testId="signature-date"
                    placeholder="mm/dd/yy"
                    register={register}
                    name={`bankDateSignature`}
                    value={formValues?.bankDateSignature}
                    elementStyle={{
                        bg: 'white',
                        borderWidth: '0 0 1px 0',
                        borderColor: 'gray.200',
                        rounded: '0',
                        paddingLeft: 0,
                    }}
                    readOnly
                />
            </FormControl>
            <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />
            <ConfirmationBox
                title="Remove Signature?"
                content="Are you sure you want to remove Signature? This action cannot be undone."
                isOpen={isDeleteConfirmationModalOpen}
                onClose={onDeleteConfirmationModalClose}
                onConfirm={onRemoveSignature}
            />
        </HStack>
    )
}

export default VendorACHForm
