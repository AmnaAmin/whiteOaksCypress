import { Box, Button, Flex, FormControl, FormLabel, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { convertImageToDataURL, trimCanvas } from 'components/table/util'
import { orderBy } from 'lodash'
import { downloadFile } from 'utils/file-utils'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiCalendar, BiCaretDown, BiCaretUp, BiDownload, BiXCircle } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import { createForm, getHelpText, useLienWaiverMutation } from 'utils/lien-waiver'
import { useDocuments } from 'utils/vendor-projects'

import SignatureModal from './signature-modal'
import { useTranslation } from 'react-i18next'
import { dateFormatter } from 'utils/new-work-order'
import jsPDF from 'jspdf'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { lienWaiverData, onClose } = props
  const { mutate: updateLienWaiver, isSuccess } = useLienWaiverMutation()
  const [documents, setDocuments] = useState<any[]>([])
  const { projectId } = useParams<'projectId'>()
  const { documents: documentsData = [] } = useDocuments({
    projectId,
  })
  const [recentLWFile, setRecentLWFile] = useState<any>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)

  const { handleSubmit, getValues, setValue } = useForm({
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

  const parseValuesToPayload = (formValues, documents) => {
    return {
      ...lienWaiverData,
      ...formValues,
      documents,
    }
  }

  const onSubmit = formValues => {
    const lienWaiverData = parseValuesToPayload(formValues, documents)
    updateLienWaiver(lienWaiverData)
  }
  useEffect(() => {
    if (isSuccess) onClose()
  }, [isSuccess, onClose])

  useEffect(() => {
    if (!documentsData?.length) return
    const orderDocs = orderBy(documentsData, ['modifiedDate'], ['desc'])
    const signatureDoc = orderDocs.find(doc => parseInt(doc.documentType, 10) === 108)
    const recentLW = orderDocs.find(doc => parseInt(doc.documentType, 10) === 26)
    setRecentLWFile(recentLW)
    setValue('claimantsSignature', signatureDoc?.s3Url)
  }, [documentsData, setValue])

  const generatePdf = useCallback(() => {
    let form = new jsPDF()
    const value = getValues()
    const dimention = {
      width: sigRef?.current?.width,
      height: sigRef?.current?.height,
    }
    convertImageToDataURL(value.claimantsSignature, (dataUrl: string) => {
      form = createForm(form, getValues(), dimention, dataUrl)
      const pdfUri = form.output('datauristring')
      const pdfBlob = form.output('bloburi')
      setRecentLWFile({
        s3Url: pdfBlob,
        fileType: 'Lien-Waver-Form.pdf',
      })
      setDocuments(doc => [
        ...doc,
        {
          documentType: 26,
          fileObject: pdfUri.split(',')[1],
          fileObjectContentType: 'application/pdf',
          fileType: 'Lien-Waver-Form.pdf',
        },
      ])
    })
  }, [getValues])

  const generateTextToImage = value => {
    const context = canvasRef?.current?.getContext('2d')

    if (!context) return

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
        fileType: 'Claimants Signature.png',
      },
    ])
    setValue('claimantsSignature', uri)
  }

  const onSignatureChange = value => {
    generateTextToImage(value)
    setValue('dateOfSignature', new Date(), { shouldValidate: true })
  }
  const [clicked, SetClicked] = useState(false)

  const InformationCard = ({ clicked }) => {
    return (
      <>
        {!clicked && (
          <Flex alignItems="center" fontSize="14px" fontWeight={600}>
            <Text mr={1}>
              <BiXCircle size={14} />
            </Text>
            <Text>{t('reject')}</Text>
          </Flex>
        )}
        {clicked && <Text>{t('save')}</Text>}
      </>
    )
  }

  return (
    <Stack>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />

      <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <VStack align="start" spacing="30px">
            <Flex w="100%" alignContent="space-between" pos="relative">
              <Box flex="4" minW="59em">
                <HelpText>{getHelpText()}</HelpText>
              </Box>
              <Flex pos="absolute" top={0} right={0} flex="1">
                {recentLWFile && (
                  <Flex alignItems={'center'}>
                    <FormLabel margin={0} fontSize="14px" fontStyle="normal" fontWeight={500} color="gray.700" pr="3px">
                      Recent LW:
                    </FormLabel>

                    <Button
                      fontSize="14px"
                      fontWeight={500}
                      bg="white"
                      color="#4E87F8"
                      float="right"
                      mr={3}
                      h="48px"
                      onClick={() => downloadFile(recentLWFile?.s3Url)}
                    >
                      <Box pos="relative" right="6px"></Box>
                      {recentLWFile.fileType}
                    </Button>
                  </Flex>
                )}
              </Flex>
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

                <HStack>
                  <InputView
                    Icon={<BiCalendar />}
                    controlStyle={{ w: '20em' }}
                    label="Date of signature"
                    InputElem={<Text>{dateFormatter(lienWaiverData.dateOfSignature)}</Text>}
                  />

                  <InputView
                    controlStyle={{ w: '20em' }}
                    label="Claimant Signature"
                    InputElem={
                      <Text fontWeight="600" fontStyle="italic">
                        {lienWaiverData.claimantTitle}
                      </Text>
                    }
                  />
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </FormControl>

        <Flex mt="70px" borderTop="1px solid #CBD5E0" h="100px" alignItems="center" justifyContent="end">
          <HStack w="100%" justifyContent={'start'} mb={2} alignItems={'start'}>
            <Flex w="100%" alignContent="space-between" pos="relative">
              <Flex fontSize="14px" fontWeight={500} mr={1}>
                <Button onClick={generatePdf} colorScheme="#4E87F8" variant="outline" color="#4E87F8" mr={2}>
                  <Text mr={1}>
                    <BiDownload size={14} />
                  </Text>
                  See LW2705_AR
                </Button>
              </Flex>
            </Flex>
          </HStack>

          <Button
            colorScheme="CustomPrimaryColor"
            onClick={() => SetClicked(true)}
            _focus={{ outline: 'none' }}
            fontStyle="normal"
            fontSize="14px"
            fontWeight={600}
            h="48px"
            w="130px"
          >
            <InformationCard clicked={clicked} />
          </Button>
          <Button
            ml={3}
            onClick={onClose}
            colorScheme="blue"
            variant="outline"
            fontStyle="normal"
            fontSize="14px"
            fontWeight={600}
            h="48px"
            w="130px"
          >
            {t('cancel')}
          </Button>
        </Flex>
      </form>
    </Stack>
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
