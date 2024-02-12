import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Link,
  ModalFooter,
  Text,
  VStack,
  IconButton,
  useDisclosure,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { convertImageToDataURL } from 'components/table/util'
import { dateFormatNew } from 'utils/date-time-utils'
import { downloadFile, imgUtility } from 'utils/file-utils'
import jsPdf from 'jspdf'
import { head } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BiAddToQueue, BiCaretDown, BiCaretUp, BiDownload, BiSpreadsheet, BiTrash, BiUpload } from 'react-icons/bi'
import { FormInput } from 'components/react-hook-form-fields/input'
import { createForm, GetHelpText } from 'utils/lien-waiver'
import { useLWFieldsStatusDecision, useUpdateWorkOrderMutation } from 'api/work-order'
import SignatureModal from '../../vendor/vendor-work-order/lien-waiver/signature-modal'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { STATUS } from '../../common/status'
import { ConfirmationBox } from 'components/Confirmation'
import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/alert'
import { CloseButton } from '@chakra-ui/react'
import { orderBy } from 'lodash'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import { MdOutlineCancel } from 'react-icons/md'
import { readFileContent } from 'api/vendor-details'
import { truncateWithEllipsis } from 'utils/string-formatters'
import { useLocation } from 'react-router-dom'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { workOrder, onClose, onProjectTabChange, documentsData, navigateToProjectDetails, isUpdating, setIsUpdating } =
    props
  const { mutate: updateLienWaiver, isSuccess } = useUpdateWorkOrderMutation({
    setUpdating: () => {
      setIsUpdating(false)
    },
  })
  const [documents, setDocuments] = useState<any[]>([])
  const [recentLWFile, setRecentLWFile] = useState<any>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)
  const [claimantsSignature, setClaimantsSignature] = useState('')
  const { isOpen: isGenerateLWOpen, onClose: onGenerateLWClose, onOpen: onGenerateLWOpen } = useDisclosure()
  const [isPdfGenerated, setPdfGenerated] = useState(false)
  const { isVendor } = useUserRolesSelector()
  const { isFieldsDisabled } = useLWFieldsStatusDecision({ workOrder: workOrder })
  const inputRef = useRef<HTMLInputElement | null>(null)
  // const isReadOnly = useRoleBasedPermissions()?.permissions?.some(p => ['PAYABLE.READ', 'PROJECT.READ']?.includes(p))
  const { pathname } = useLocation()
  const isPayable = pathname?.includes('payable')
  const isPayableRead = useRoleBasedPermissions()?.permissions?.includes('PAYABLE.READ') && isPayable
  const isProjRead = useRoleBasedPermissions()?.permissions?.includes('PROJECT.READ')
  const isReadOnly = isPayableRead || isProjRead
  type FormValueType = {
    claimantName: string | null | undefined
    customerName: string | null | undefined
    propertyAddress: string | null | undefined
    owner: string
    makerOfCheck: string | null | undefined
    finalInvoiceAmount: string | number | null | undefined
    checkPayableTo: string | null | undefined
    claimantsSignature: any
    claimantTitle: string | null | undefined
    dateOfSignature: string | Date | null | undefined
    uploadLW: any
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm<FormValueType>({
    defaultValues: {
      claimantName: workOrder.claimantName,
      customerName: workOrder.customerName,
      propertyAddress: workOrder.propertyAddress,
      owner: 'White Oaks Aligned, LLC',
      makerOfCheck: workOrder.makerOfCheck,
      finalInvoiceAmount: workOrder.finalInvoiceAmount,
      checkPayableTo: workOrder.claimantName,
      claimantsSignature: workOrder.lienWaiverAccepted ? workOrder.claimantsSignature : null,
      claimantTitle: workOrder.lienWaiverAccepted ? workOrder.claimantTitle : '',
      dateOfSignature: workOrder.lienWaiverAccepted ? workOrder.dateOfSignature : '',
      uploadLW: null,
    },
  })
  const formValues = useWatch({ control })
  const document = useWatch({ name: 'uploadLW', control })

  const parseValuesToPayload = (formValues, documents) => {
    return {
      ...workOrder,
      ...formValues,
      lienWaiverAccepted: true,
      amountOfCheck: formValues.finalInvoiceAmount,
      documents,
    }
  }
  const onGenerateLW = useCallback(() => {
    setPdfGenerated(true)
    let form = new jsPdf()
    const dimention = {
      width: sigRef?.current?.width,
      height: sigRef?.current?.height,
    }
    const [first, last] = workOrder?.companyName?.split(' ') || []
    convertImageToDataURL(claimantsSignature, (dataUrl: string) => {
      const formattedAmountOfCheck = formValues.finalInvoiceAmount ? '$' + formValues.finalInvoiceAmount : '$0.00'
      form = createForm(form, { ...formValues, amountOfCheck: formattedAmountOfCheck }, dimention, dataUrl)
      const pdfUri = form.output('datauristring')
      const docs = [
        ...documents,
        {
          documentType: 26,
          workOrderId: workOrder.id,
          fileObject: pdfUri.split(',')[1],
          fileObjectContentType: 'application/pdf',
          fileType: `LW${workOrder?.id ?? ''}_${head(first) ?? ''}${head(last) ?? ''}.pdf`,
        },
      ]
      const payload = parseValuesToPayload(formValues, docs)
      updateLienWaiver(payload, {
        onError() {
          setPdfGenerated(false)
        },
        onSuccess() {
          setPdfGenerated(false)
          onGenerateLWClose()
        },
      })
    })
  }, [claimantsSignature, workOrder, formValues, documents])

  useEffect(() => {
    if (isSuccess) {
      onProjectTabChange?.(2)
    }
  }, [isSuccess, onClose])

  useEffect(() => {
    if (!documentsData?.length) return
    if (workOrder.lienWaiverAccepted) {
      const orderDocs = orderBy(
        documentsData,
        [
          item => {
            const createdDate = new Date(item.createdDate)
            return createdDate
          },
        ],
        ['desc'],
      )
      const signatureDoc = orderDocs.find(
        doc => parseInt(doc.documentType, 10) === 108 && doc.workOrderId === workOrder.id,
      )
      const recentLW = orderDocs.find(doc => parseInt(doc.documentType, 10) === 26 && doc.workOrderId === workOrder.id)
      setRecentLWFile(recentLW)
      setValue('claimantsSignature', signatureDoc?.s3Url)
      setClaimantsSignature(signatureDoc?.s3Url ?? '')
      setValue('claimantTitle', workOrder.claimantTitle)
      setValue('dateOfSignature', workOrder.dateOfSignature)
    } else {
      setRecentLWFile(null)
      setValue('claimantsSignature', null)
      setValue('claimantTitle', '')
      setValue('dateOfSignature', '')
      setClaimantsSignature('')
    }
  }, [documentsData, setValue, workOrder])

  const convertSignatureTextToImage = value => {
    const uri = imgUtility.generateTextToImage(canvasRef, value)
    setDocuments(doc => [
      ...doc,
      {
        documentType: 108,
        workOrderId: workOrder.id,
        fileObject: uri?.split(',')[1],
        fileObjectContentType: 'image/png',
        fileType: 'Claimants-Signature.png',
      },
    ])
    setValue('claimantsSignature', uri)
    setClaimantsSignature(uri)
  }

  const onSignatureChange = value => {
    convertSignatureTextToImage(value)
    setValue('dateOfSignature', new Date(), { shouldValidate: true })
  }
  const onRemoveSignature = () => {
    setClaimantsSignature('')
    setValue('claimantsSignature', null)
    setValue('dateOfSignature', null)
  }

  const onFileChange = useCallback(
    e => {
      const files = e.target.files
      if (files[0]) {
        setValue('uploadLW', files[0])
      }
    },
    [setValue],
  )

  const lwUpload = async () => {
    const fileContents = await readFileContent(document as File)
    const fileExtension = document?.type?.split('/')[1] || ''
    const [first, last] = workOrder?.companyName?.split(' ') || []
    const documents = [
      {
        documentType: 26,
        workOrderId: workOrder.id,
        fileObject: fileContents,
        fileObjectContentType: document.type,
        fileType: `LW${workOrder?.id ?? ''}_${head(first) ?? ''}${head(last) ?? ''}.${fileExtension}`,
      },
    ]
    setIsUpdating(true)
    updateLienWaiver(
      { ...workOrder, lienWaiverAccepted: true, amountOfCheck: workOrder.finalInvoiceAmount, documents },
      {
        onSettled: () => {
          setIsUpdating(false)
        },
        onSuccess: () => {
          setValue('uploadLW', null)
          setIsUpdating(false)
        },
        onError: () => {
          setIsUpdating(false)
        },
      },
    )
  }

  return (
    <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onGenerateLWOpen)}>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />
      {/* <ModalBody h="600px" p="25px" overflow={'auto'}> */}
      <FormControl h="600px" overflow={'auto'} p="25px">
        <VStack align="start" spacing="30px">
          {workOrder?.leanWaiverSubmitted && !workOrder?.lienWaiverAccepted && isVendor && (
            <Alert data-testid="lienWaiverRejectInfo" status="info" variant="custom" size="sm">
              <AlertIcon />
              <AlertDescription>{workOrder?.rejectedUserRole + ' ' + t('lienWaiverRejectInfo')}</AlertDescription>
              <CloseButton alignSelf="flex-start" position="absolute" right={2} top={2} size="sm" />
            </Alert>
          )}
          <Flex alignContent="space-between" pos="relative">
            <Box overflowWrap={'break-word'} whiteSpace="normal" w="48em">
              <HelpText>{GetHelpText()}</HelpText>
            </Box>
          </Flex>
          <Box w="100%">
            <Grid
              templateColumns={{
                base: 'repeat(auto-fill,minmax(215px ,1fr))',
                md: 'repeat(auto-fill,minmax(215px ,0fr))',
              }}
              gap={20}
              w={{ base: '100%', lg: '630px' }}
            >
              <GridItem>
                <InputView
                  label={t('nameofClaimant')}
                  InputElem={
                    <Text data-testid="nameOfClaimant">{truncateWithEllipsis(workOrder.claimantName, 25)}</Text>
                  }
                />
              </GridItem>
              <GridItem>
                <InputView
                  label={t('jobLocation')}
                  InputElem={<Text data-testid="propertyAddress">{workOrder.propertyAddress}</Text>}
                />
              </GridItem>
              <GridItem>
                <InputView
                  label={t('makerOfCheck')}
                  InputElem={<Text data-testid="makerOfCheck">{workOrder.makerOfCheck}</Text>}
                />
              </GridItem>
              <GridItem>
                <InputView
                  label={t('amountOfCheck')}
                  InputElem={<Text data-testid="amountOfCheck">${workOrder.finalInvoiceAmount}</Text>}
                />
              </GridItem>
            </Grid>
            {isVendor ? (
              <Grid
                templateColumns={{
                  base: 'repeat(auto-fill,minmax(215px ,1fr))',
                  md: 'repeat(auto-fill,minmax(215px ,0fr))',
                }}
                gap={10}
                mt={8}
              >
                <GridItem>
                  <FormInput
                    errorMessage={errors.claimantTitle && errors.claimantTitle?.message}
                    label={t('claimantsTitle')}
                    placeholder=""
                    variant="required-field"
                    register={register}
                    disabled={isFieldsDisabled}
                    testId="claimantsTitle"
                    rules={{ required: 'This is required field' }}
                    name={`claimantTitle`}
                  />
                </GridItem>
                <GridItem>
                  <FormControl isInvalid={!claimantsSignature}>
                    <FormLabel fontWeight={500} fontSize="14px" color="gray.700">
                      {t('claimantsSignature')}
                    </FormLabel>
                    <Button
                      pos="relative"
                      border={'1px solid'}
                      borderColor="gray.200"
                      borderRadius="6px"
                      bg="white"
                      height={'40px'}
                      borderLeftWidth={'2.5px'}
                      borderLeftColor="#345EA6"
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
                      disabled={isFieldsDisabled}
                      onClick={() => setOpenSignature(true)}
                    >
                      <canvas hidden ref={canvasRef} height={'64px'} width={'1000px'}></canvas>
                      <Image
                        data-testid="claimantsSignature"
                        hidden={!claimantsSignature}
                        maxW={'100%'}
                        src={claimantsSignature}
                        {...register('claimantsSignature', {
                          required: 'This is required field',
                        })}
                        ref={sigRef}
                      />
                      {!isFieldsDisabled && (
                        <HStack pos={'absolute'} right="10px" top="11px" spacing={3}>
                          <IconButton
                            aria-label="open-signature"
                            variant="ghost"
                            minW="auto"
                            height="auto"
                            _hover={{ bg: 'inherit' }}
                            disabled={isFieldsDisabled}
                            data-testid="openSignature"
                          >
                            <BiAddToQueue color="#A0AEC0" />
                          </IconButton>
                          {claimantsSignature && (
                            <IconButton
                              aria-label="open-signature"
                              variant="ghost"
                              minW="auto"
                              height="auto"
                              _hover={{ bg: 'inherit' }}
                              disabled={isFieldsDisabled}
                              data-testid="removeSignature"
                              onClick={e => {
                                onRemoveSignature()
                                e.stopPropagation()
                              }}
                            >
                              <BiTrash className="mr-1" color="#A0AEC0" />
                            </IconButton>
                          )}
                        </HStack>
                      )}
                    </Button>
                    {errors?.claimantsSignature?.message && <FormErrorMessage>This is required field</FormErrorMessage>}
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormInput
                    errorMessage={errors?.dateOfSignature?.message}
                    label={t('dateOfSignature')}
                    testId="signature-date"
                    placeholder="mm/dd/yy"
                    register={register}
                    name={`dateOfSignature`}
                    value={dateFormatNew(formValues?.dateOfSignature as string)}
                    elementStyle={{
                      bg: 'white',
                      borderWidth: '0 0 1px 0',
                      borderColor: 'gray.200',
                      rounded: '0',
                      paddingLeft: 0,
                    }}
                    rules={{ required: 'This is required field' }}
                    readOnly
                  />
                </GridItem>
              </Grid>
            ) : (
              <Grid templateColumns="repeat(auto-fill,minmax(215px ,0fr))" mt={69} gap={20}>
                <GridItem>
                  <InputView
                    controlStyle={{ w: '14em' }}
                    label="Date of signature"
                    InputElem={
                      <>
                        {workOrder?.lienWaiverAccepted && workOrder?.dateOfSignature
                          ? dateFormatNew(workOrder?.dateOfSignature)
                          : 'mm/dd/yy'}
                      </>
                    }
                  />
                </GridItem>
                <GridItem>
                  <InputView
                    controlStyle={{ mb: '5px' }}
                    label="Claimant Signature"
                    InputElem={
                      workOrder?.lienWaiverAccepted && claimantsSignature ? (
                        <Image mt="7px" hidden={!claimantsSignature} maxW={'100%'} src={claimantsSignature} />
                      ) : (
                        <></>
                      )
                    }
                  />
                </GridItem>
              </Grid>
            )}
          </Box>
        </VStack>
      </FormControl>
      {/* </ModalBody> */}
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <HStack justifyContent="start" w="100%">
          {navigateToProjectDetails && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              onClick={navigateToProjectDetails}
              leftIcon={<BiSpreadsheet />}
            >
              {t('seeProjectDetails')}
            </Button>
          )}

          {workOrder?.lienWaiverAccepted && recentLWFile && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              data-testid="recentLW"
              mr={3}
              disabled={workOrder?.statusLabel === STATUS.Cancelled}
              onClick={() => downloadFile(recentLWFile.s3Url)}
              leftIcon={<BiDownload />}
            >
              <Box pos="relative" right="6px"></Box>
              See {recentLWFile.fileType?.split('.')[0]}
            </Button>
          )}
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={onFileChange}
            data-testid="upload-LW"
            accept="application/pdf, image/png, image/jpg, image/jpeg"
          />
          {!isVendor &&
            [STATUS.Rejected, STATUS.Completed].includes(workOrder?.statusLabel?.toLocaleLowerCase()) &&
            (!!document ? (
              <Box color="barColor.100" border="1px solid #4E87F8" borderRadius="4px" fontSize="14px">
                <HStack spacing="5px" h="38px" padding="10px" align="center">
                  <Text as="span" maxW="120px" isTruncated title={document?.name || document?.fileType}>
                    {document?.name || document?.fileType}
                  </Text>
                  <MdOutlineCancel
                    cursor="pointer"
                    onClick={() => {
                      setValue('uploadLW', null)
                      if (inputRef.current) inputRef.current.value = ''
                    }}
                  />
                </HStack>
              </Box>
            ) : (
              <Button
                onClick={e => {
                  if (inputRef.current) {
                    inputRef.current.click()
                  }
                }}
                leftIcon={<BiUpload />}
                variant="outline"
                size="md"
                colorScheme="brand"
              >
                {t('uploadLW')}
              </Button>
            ))}
        </HStack>
        <HStack spacing="16px" justifyContent="end">
          {onClose && (
            <Button variant="outline" colorScheme="darkPrimary" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
          <>
            {!isVendor ? (
              <>
                {!isReadOnly && (
                  <Button
                    onClick={() => lwUpload()}
                    colorScheme="brand"
                    isDisabled={!document || isUpdating}
                    data-testid="cancel-lien-waiver"
                  >
                    {t('save')}
                  </Button>
                )}
              </>
            ) : (
              <>
                {[STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(
                  workOrder?.statusLabel?.toLocaleLowerCase(),
                ) &&
                  !(workOrder.leanWaiverSubmitted && workOrder.lienWaiverAccepted) && (
                    <Button colorScheme="brand" disabled={isUpdating} type="submit" data-testid="save-lien-waiver">
                      {t('save')}
                    </Button>
                  )}
              </>
            )}
          </>
        </HStack>
      </ModalFooter>
      <ConfirmationBox
        title="Lien Waiver"
        content="Are you sure you want to generate Lien Waiver?"
        isOpen={isGenerateLWOpen}
        onClose={onGenerateLWClose}
        onConfirm={onGenerateLW}
        isLoading={isPdfGenerated}
      />
    </form>
  )
}

const HelpText = ({ children }) => {
  const { t } = useTranslation()
  const text = children
  const [isReadMore, setIsReadMore] = useState(false)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }
  return (
    <>
      {!isReadMore ? (
        <Link onClick={toggleReadMore} style={{ color: 'gray.700' }}>
          <Flex color={'#345EA6'} fontStyle="normal" fontWeight={500} fontSize="14px">
            <Box>{t('readMore')}</Box>
            <Box ml="3px" mt="3px">
              <BiCaretDown />
            </Box>
          </Flex>
        </Link>
      ) : (
        <Link onClick={toggleReadMore}>
          <Flex color={'#345EA6'} fontStyle="normal" fontWeight={500} fontSize="14px" style={{ color: 'gray.700' }}>
            <Box>{t('readLess')}</Box>
            <Box ml="3px" mt="4px">
              <BiCaretUp />
            </Box>
          </Flex>
        </Link>
      )}
      {isReadMore && (
        <Box mt="28px" className="text">
          {text}
        </Box>
      )}
    </>
  )
}
