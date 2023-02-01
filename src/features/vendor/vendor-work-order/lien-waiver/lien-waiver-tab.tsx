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
  ModalBody,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { convertImageToDataURL } from 'components/table/util'
import { dateFormat } from 'utils/date-time-utils'
import { downloadFile, imgUtility } from 'utils/file-utils'
import jsPdf from 'jspdf'
import { head } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BiCaretDown, BiCaretUp, BiDownload, BiEditAlt, BiTrash } from 'react-icons/bi'
import { FormInput } from 'components/react-hook-form-fields/input'
import { createForm, GetHelpText } from 'utils/lien-waiver'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import SignatureModal from './signature-modal'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { STATUS } from '../../../common/status'
import { ConfirmationBox } from 'components/Confirmation'
import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/alert'
import { CloseButton } from '@chakra-ui/react'
import { orderBy } from 'lodash'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { lienWaiverData, onClose, onProjectTabChange, documentsData } = props
  const { mutate: updateLienWaiver, isSuccess } = useUpdateWorkOrderMutation({})
  const [documents, setDocuments] = useState<any[]>([])
  const [recentLWFile, setRecentLWFile] = useState<any>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)
  const [claimantsSignature, setClaimantsSignature] = useState('')
  const { isOpen: isGenerateLWOpen, onClose: onGenerateLWClose, onOpen: onGenerateLWOpen } = useDisclosure()
  const [isPdfGenerated, setPdfGenerated] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      claimantName: lienWaiverData.claimantName,
      customerName: lienWaiverData.customerName,
      propertyAddress: lienWaiverData.propertyAddress,
      owner: 'White Oaks Aligned, LLC',
      makerOfCheck: lienWaiverData.makerOfCheck,
      finalInvoiceAmount: lienWaiverData.finalInvoiceAmount,
      checkPayableTo: lienWaiverData.claimantName,
      claimantsSignature: lienWaiverData.lienWaiverAccepted ? lienWaiverData.claimantsSignature : null,
      claimantTitle: lienWaiverData.lienWaiverAccepted ? lienWaiverData.claimantTitle : '',
      dateOfSignature: lienWaiverData.lienWaiverAccepted ? lienWaiverData.dateOfSignature : '',
    },
  })
  const formValues = useWatch({ control })

  const parseValuesToPayload = (formValues, documents) => {
    return {
      ...lienWaiverData,
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
    const [first, last] = lienWaiverData?.companyName?.split(' ') || []
    convertImageToDataURL(claimantsSignature, (dataUrl: string) => {
      const formattedAmountOfCheck = formValues.finalInvoiceAmount ? '$' + formValues.finalInvoiceAmount : '$0.00'
      form = createForm(form, { ...formValues, amountOfCheck: formattedAmountOfCheck }, dimention, dataUrl)
      const pdfUri = form.output('datauristring')
      const docs = [
        ...documents,
        {
          documentType: 26,
          workOrderId: lienWaiverData.id,
          fileObject: pdfUri.split(',')[1],
          fileObjectContentType: 'application/pdf',
          fileType: `LW${lienWaiverData?.id ?? ''}_${head(first) ?? ''}${head(last) ?? ''}.pdf`,
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
  }, [claimantsSignature, lienWaiverData, formValues, documents])

  useEffect(() => {
    if (isSuccess) {
      onProjectTabChange?.(2)
    }
  }, [isSuccess, onClose])

  useEffect(() => {
    if (!documentsData?.length) return
    if (lienWaiverData.lienWaiverAccepted) {
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
        doc => parseInt(doc.documentType, 10) === 108 && doc.workOrderId === lienWaiverData.id,
      )
      const recentLW = orderDocs.find(
        doc => parseInt(doc.documentType, 10) === 26 && doc.workOrderId === lienWaiverData.id,
      )
      setRecentLWFile(recentLW)
      setValue('claimantsSignature', signatureDoc?.s3Url)
      setClaimantsSignature(signatureDoc?.s3Url ?? '')
      setValue('claimantTitle', lienWaiverData.claimantTitle)
      setValue('dateOfSignature', lienWaiverData.dateOfSignature)
    } else {
      setRecentLWFile(null)
      setValue('claimantsSignature', null)
      setValue('claimantTitle', '')
      setValue('dateOfSignature', '')
      setClaimantsSignature('')
    }
  }, [documentsData, setValue, lienWaiverData])

  const convertSignatureTextToImage = value => {
    const uri = imgUtility.generateTextToImage(canvasRef, value)
    setDocuments(doc => [
      ...doc,
      {
        documentType: 108,
        workOrderId: lienWaiverData.id,
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
  return (
    <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onGenerateLWOpen)}>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />
      <ModalBody h={'calc(100vh - 300px)'} p="25px" overflow={'auto'}>
        <FormControl>
          <VStack align="start" spacing="30px">
            {lienWaiverData?.leanWaiverSubmitted && !lienWaiverData?.lienWaiverAccepted && (
              <Alert data-testid="lienWaiverRejectInfo" status="info" variant="custom" size="sm">
                <AlertIcon />
                <AlertDescription>{t('lienWaiverRejectInfo')}</AlertDescription>
                <CloseButton alignSelf="flex-start" position="absolute" right={2} top={2} size="sm" />
              </Alert>
            )}
            <Flex w="100%" alignContent="space-between" pos="relative">
              <Box flex="4" minW="59em">
                <HelpText>{GetHelpText()}</HelpText>
              </Box>
            </Flex>
            <Box>
              <VStack alignItems="start">
                <HStack spacing="3">
                  <InputView
                    controlStyle={{ w: '16em' }}
                    label={t('nameofClaimant')}
                    InputElem={<Text data-testid="nameOfClaimant">{lienWaiverData.claimantName}</Text>}
                  />

                  <InputView
                    controlStyle={{ w: '16em' }}
                    label={t('jobLocation')}
                    InputElem={<Text data-testid="propertyAddress">{lienWaiverData.propertyAddress}</Text>}
                  />
                </HStack>

                <HStack pt={'20px'} spacing="3">
                  <InputView
                    controlStyle={{ w: '16em' }}
                    label={t('makerOfCheck')}
                    InputElem={<Text data-testid="makerOfCheck">{lienWaiverData.makerOfCheck}</Text>}
                  />
                  <InputView
                    controlStyle={{ w: '16em' }}
                    label={t('amountOfCheck')}
                    InputElem={<Text data-testid="amountOfCheck">${lienWaiverData.finalInvoiceAmount}</Text>}
                  />
                </HStack>

                <HStack pt={'20px'} alignItems={'flex-start'} spacing="3">
                  <FormInput
                    errorMessage={errors.claimantTitle && errors.claimantTitle?.message}
                    label={t('claimantsTitle')}
                    placeholder=""
                    register={register}
                    controlStyle={{ w: '16em' }}
                    disabled={
                      ![STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(
                        lienWaiverData?.statusLabel?.toLocaleLowerCase(),
                      ) ||
                      (lienWaiverData.leanWaiverSubmitted && lienWaiverData?.lienWaiverAccepted)
                    }
                    elementStyle={{
                      bg: 'white',
                      borderLeft: '2px solid #4E87F8',
                    }}
                    testId="claimantsTitle"
                    rules={{ required: 'This is required field' }}
                    name={`claimantTitle`}
                  />
                  <FormControl isInvalid={!claimantsSignature} width={'16em'}>
                    <FormLabel fontWeight={500} fontSize="14px" color="gray.600">
                      {t('claimantsSignature')}
                    </FormLabel>
                    <Button
                      pos="relative"
                      border={'1px solid'}
                      borderColor="gray.200"
                      borderRadius="6px"
                      bg="white"
                      height={'40px'}
                      borderLeftWidth={'2px'}
                      borderLeftColor="CustomPrimaryColor.50"
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
                      disabled={
                        ![STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(
                          lienWaiverData?.statusLabel?.toLocaleLowerCase(),
                        ) ||
                        (lienWaiverData.leanWaiverSubmitted && lienWaiverData?.lienWaiverAccepted)
                      }
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

                      <HStack pos={'absolute'} right="10px" top="11px" spacing={3}>
                        <IconButton
                          aria-label="open-signature"
                          variant="ghost"
                          minW="auto"
                          height="auto"
                          _hover={{ bg: 'inherit' }}
                          disabled={
                            ![STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(
                              lienWaiverData?.statusLabel?.toLocaleLowerCase(),
                            ) ||
                            (lienWaiverData.leanWaiverSubmitted && lienWaiverData?.lienWaiverAccepted)
                          }
                          data-testid="openSignature"
                          onClick={() => setOpenSignature(true)}
                        >
                          <BiEditAlt color="#A0AEC0" />
                        </IconButton>
                        {claimantsSignature && (
                          <IconButton
                            aria-label="open-signature"
                            variant="ghost"
                            minW="auto"
                            height="auto"
                            _hover={{ bg: 'inherit' }}
                            disabled={
                              ![STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(
                                lienWaiverData?.statusLabel?.toLocaleLowerCase(),
                              ) ||
                              (lienWaiverData.leanWaiverSubmitted && lienWaiverData?.lienWaiverAccepted)
                            }
                            data-testid="removeSignature"
                            onClick={onRemoveSignature}
                          >
                            <BiTrash className="mr-1" color="#A0AEC0" />
                          </IconButton>
                        )}
                      </HStack>
                    </Button>
                    {errors?.claimantsSignature?.message && <FormErrorMessage>This is required field</FormErrorMessage>}
                  </FormControl>

                  <FormInput
                    errorMessage={errors?.dateOfSignature?.message}
                    label={t('dateOfSignature')}
                    testId="signature-date"
                    placeholder="mm/dd/yy"
                    register={register}
                    name={`dateOfSignature`}
                    value={dateFormat(formValues.dateOfSignature)}
                    controlStyle={{ w: '16em' }}
                    elementStyle={{
                      bg: 'white',
                      borderWidth: '0 0 1px 0',
                      borderColor: 'gray.100',
                      rounded: '0',
                      paddingLeft: 0,
                    }}
                    rules={{ required: 'This is required field' }}
                    readOnly
                  />
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </FormControl>
      </ModalBody>
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <Flex justifyContent="start" w="100%">
          {lienWaiverData?.lienWaiverAccepted && recentLWFile && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              data-testid="recentLW"
              mr={3}
              disabled={lienWaiverData?.statusLabel === STATUS.Cancelled}
              onClick={() => downloadFile(recentLWFile.s3Url)}
              leftIcon={<BiDownload />}
            >
              <Box pos="relative" right="6px"></Box>
              See {recentLWFile.fileType?.split('.')[0]}
            </Button>
          )}
        </Flex>
        <HStack spacing="16px" justifyContent="end">
          {[STATUS.Completed, STATUS.Invoiced, STATUS.Rejected].includes(
            lienWaiverData?.statusLabel?.toLocaleLowerCase(),
          ) ? (
            !(lienWaiverData.leanWaiverSubmitted && lienWaiverData.lienWaiverAccepted) && (
              <>
                <Button variant="outline" colorScheme="brand" onClick={onClose}>
                  {t('cancel')}
                </Button>
                <Button colorScheme="brand" type="submit" data-testid="save-lien-waiver">
                  {t('save')}
                </Button>
              </>
            )
          ) : (
            <Button colorScheme="brand" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
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
        <Link onClick={toggleReadMore} style={{ color: '#4A5568' }}>
          <Flex fontStyle="normal" fontWeight={500} fontSize="14px">
            <Box>{t('readMore')}</Box>
            <Box ml="3px" mt="3px">
              <BiCaretDown />
            </Box>
          </Flex>
        </Link>
      ) : (
        <Link onClick={toggleReadMore}>
          <Flex fontStyle="normal" fontWeight={500} fontSize="14px" style={{ color: '#4A5568' }}>
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
