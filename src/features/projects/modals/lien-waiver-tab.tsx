import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Link,
  ModalFooter,
  Stack,
  Text,
  VStack,
  ModalBody,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { convertImageToDataURL } from 'components/table/util'
import { dateFormat } from 'utils/date-time-utils'
import { downloadFile } from 'utils/file-utils'
import jsPdf from 'jspdf'
import { orderBy } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiCalendar, BiCaretDown, BiCaretUp, BiDownload, BiEditAlt, BiTrash } from 'react-icons/bi'
import { FormInput } from 'components/react-hook-form-fields/input'
import { createForm, GetHelpText } from 'utils/lien-waiver'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import trimCanvas from 'trim-canvas'
import SignatureModal from './signature-modal'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { lienWaiverData, onClose, onProjectTabChange, documentsData } = props
  const { mutate: updateLienWaiver, isSuccess } = useUpdateWorkOrderMutation()
  const [documents, setDocuments] = useState<any[]>([])

  const [recentLWFile, setRecentLWFile] = useState<any>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)
  const [claimantsSignature, setClaimantsSignature] = useState('')
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      claimantName: lienWaiverData.claimantName,
      customerName: lienWaiverData.customerName,
      propertyAddress: lienWaiverData.propertyAddress,
      owner: lienWaiverData.owner,
      makerOfCheck: lienWaiverData.makerOfCheck,
      amountOfCheck: lienWaiverData.amountOfCheck,
      checkPayableTo: lienWaiverData.claimantName,
      claimantsSignature: lienWaiverData.claimantsSignature,
      claimantTitle: lienWaiverData.claimantTitle,
      dateOfSignature: lienWaiverData.dateOfSignature,
    },
  })
  const value = getValues()
  const parseValuesToPayload = (formValues, documents) => {
    return {
      ...lienWaiverData,
      ...formValues,
      documents,
    }
  }
  const onSubmit = formValues => {
    const submitForm = documents => {
      const lienWaiverData = parseValuesToPayload(formValues, documents)
      updateLienWaiver(lienWaiverData)
    }
    if (recentLWFile) {
      submitForm(documents)
      return
    }
    generatePdf(submitForm)
  }
  useEffect(() => {
    if (isSuccess) {
      onProjectTabChange?.(2)
    }
  }, [isSuccess, onClose])

  useEffect(() => {
    if (!documentsData?.length) return
    const orderDocs = orderBy(documentsData, ['modifiedDate'], ['desc'])
    const signatureDoc = orderDocs.find(doc => parseInt(doc.documentType, 10) === 108)
    const recentLW = orderDocs.find(doc => parseInt(doc.documentType, 10) === 26)
    setRecentLWFile(recentLW)
    setValue('claimantsSignature', signatureDoc?.s3Url)
    setClaimantsSignature(signatureDoc?.s3Url ?? '')
  }, [documentsData, setValue])

  const generatePdf = useCallback(
    onComplete => {
      let form = new jsPdf()
      const dimention = {
        width: sigRef?.current?.width,
        height: sigRef?.current?.height,
      }
      convertImageToDataURL(claimantsSignature, (dataUrl: string) => {
        form = createForm(form, getValues(), dimention, dataUrl)
        const pdfUri = form.output('datauristring')
        const pdfBlob = form.output('bloburi')
        setRecentLWFile({
          s3Url: pdfBlob,
          fileType: 'Lien-Waver-Form.pdf',
        })
        const docs = [
          ...documents,
          {
            documentType: 26,
            fileObject: pdfUri.split(',')[1],
            fileObjectContentType: 'application/pdf',
            fileType: 'Lien-Waver-Form.pdf',
          },
        ]
        setDocuments(docs)
        onComplete(docs)
      })
    },
    [getValues, claimantsSignature],
  )

  const generateTextToImage = value => {
    const context = canvasRef?.current?.getContext('2d')

    if (!context || !canvasRef.current) return
    canvasRef.current.width = 1000
    canvasRef.current.height = 64

    context.clearRect(0, 0, canvasRef?.current?.width ?? 0, canvasRef?.current?.height ?? 0)
    context.font = 'italic 500 12px Inter'
    context.textAlign = 'start'
    context.fillText(value, 10, 50)
    const trimContext = trimCanvas(canvasRef.current)

    const uri = trimContext?.toDataURL('image/png')
    setDocuments(doc => [
      ...doc,
      {
        documentType: 108,
        fileObject: uri?.split(',')[1],
        fileObjectContentType: 'image/png',
        fileType: 'Claimants-Signature.png',
      },
    ])
    setValue('claimantsSignature', uri)
    setClaimantsSignature(uri)
  }

  const onSignatureChange = value => {
    generateTextToImage(value)
    setValue('dateOfSignature', new Date(), { shouldValidate: true })
  }
  const onRemoveSignature = () => {
    setClaimantsSignature('')
    setValue('claimantsSignature', null)
    setValue('dateOfSignature', null)
  }
  return (
    <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onSubmit)}>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />
      <ModalBody h="400px" p="25px" overflow={'auto'}>
        <FormControl>
          <VStack align="start" spacing="30px">
            <Flex w="100%" alignContent="space-between" pos="relative">
              <Box flex="4" minW="59em">
                <HelpText>{GetHelpText()}</HelpText>
              </Box>
            </Flex>
            <Box>
              <VStack alignItems="start">
                <HStack>
                  <InputView
                    controlStyle={{ w: '20em' }}
                    label={t('nameofClaimant')}
                    InputElem={<Text>{lienWaiverData.claimantName}</Text>}
                  />

                  <InputView
                    controlStyle={{ w: '20em' }}
                    label={t('jobLocation')}
                    InputElem={<Text>{lienWaiverData.propertyAddress}</Text>}
                  />
                </HStack>
                <HStack></HStack>
                <HStack>
                  <InputView
                    controlStyle={{ w: '20em' }}
                    label={t('makerOfCheck')}
                    InputElem={<Text>{lienWaiverData.makerOfCheck}</Text>}
                  />
                  <InputView
                    controlStyle={{ w: '20em' }}
                    label={t('amountOfCheck')}
                    InputElem={<Text>${lienWaiverData.amountOfCheck}</Text>}
                  />
                </HStack>

                <Stack pt="5" pb="5">
                  <FormInput
                    errorMessage={errors.claimantTitle && errors.claimantTitle?.message}
                    label={t('claimantsTitle')}
                    placeholder=""
                    register={register}
                    controlStyle={{ w: '293px' }}
                    elementStyle={{
                      bg: 'white',
                      borderLeft: '2px solid #4E87F8',
                    }}
                    rules={{ required: 'This is required field' }}
                    name={`claimantTitle`}
                  />
                </Stack>

                <HStack alignItems={'flex-start'} spacing="7">
                  <FormControl isInvalid={!claimantsSignature} width={'20em'}>
                    <FormLabel fontWeight={500} fontSize="14px" color="gray.600">
                      {t('claimantsSignature')}
                    </FormLabel>
                    <Flex pos="relative" bg="gray.50" height={'37px'} alignItems="end" px={4}>
                      <canvas hidden ref={canvasRef} height={'64px'} width={'1000px'}></canvas>
                      <Image
                        mb="3"
                        hidden={!claimantsSignature}
                        maxW={'100%'}
                        src={claimantsSignature}
                        {...register('claimantsSignature', {
                          required: 'This is required field',
                        })}
                        ref={sigRef}
                      />

                      <HStack pos={'absolute'} right="10px" top="11px" spacing={3}>
                        <BiEditAlt onClick={() => setOpenSignature(true)} color="#A0AEC0" />
                        {claimantsSignature && <BiTrash className="mr-1" onClick={onRemoveSignature} color="#A0AEC0" />}
                      </HStack>
                    </Flex>
                    {!claimantsSignature && <FormErrorMessage>This is required field</FormErrorMessage>}
                  </FormControl>

                  <FormInput
                    icon={<BiCalendar />}
                    errorMessage={errors.dateOfSignature && errors.dateOfSignature?.message}
                    label={t('dateOfSignature')}
                    placeholder=""
                    register={register}
                    name={`dateOfSignature`}
                    value={dateFormat(value.dateOfSignature)}
                    controlStyle={{ w: '20em' }}
                    elementStyle={{
                      bg: 'white',
                      borderWidth: '0 0 1px 0',
                      borderColor: 'gray.100',
                      rounded: '0',
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
          {recentLWFile && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="md"
              mr={3}
              onClick={() => downloadFile(recentLWFile.s3Url)}
              leftIcon={<BiDownload />}
            >
              <Box pos="relative" right="6px"></Box>
              {recentLWFile.fileType}
            </Button>
          )}
        </Flex>
        <Flex justifyContent="end">
          <Button variant="outline" colorScheme="brand" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button colorScheme="brand" type="submit">
            {t('save')}
          </Button>
        </Flex>
      </ModalFooter>
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
