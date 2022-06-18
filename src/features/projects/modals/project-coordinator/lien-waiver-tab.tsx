import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Link,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { trimCanvas } from 'components/table/util'
import { orderBy } from 'lodash'
import { downloadFile } from 'utils/file-utils'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiCaretDown, BiCaretUp, BiDownload, BiXCircle } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import { GetHelpText } from 'utils/lien-waiver'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { useDocuments } from 'utils/vendor-projects'

import SignatureModal from './signature-modal'
import { useTranslation } from 'react-i18next'
import { dateFormatter } from 'utils/date-time-utils'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { lienWaiverData, onClose } = props
  const { mutate: updateLienWaiver, isSuccess } = useUpdateWorkOrderMutation()
  const [documents, setDocuments] = useState<any[]>([])
  const { projectId } = useParams<'projectId'>()
  const { documents: documentsData = [] } = useDocuments({
    projectId,
  })
  const [recentLWFile, setRecentLWFile] = useState<any>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { handleSubmit, setValue } = useForm({
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
  const { leanwieverLink } = props.lienWaiverData

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
          <VStack align="start" spacing="30px" m="32px">
            <Flex w="100%" alignContent="space-between" pos="relative">
              <Box flex="4" minW="59em">
                <HelpText>{GetHelpText()}</HelpText>
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

            <VStack alignItems="start" spacing="32px">
              <HStack spacing="16px">
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

              <HStack spacing="16px">
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

              <HStack spacing="16px">
                <InputView
                  controlStyle={{ w: '20em' }}
                  label="Date of signature"
                  InputElem={<Text>{dateFormatter(lienWaiverData.dateOfSignature)}</Text>}
                />

                <InputView
                  controlStyle={{ w: '20em' }}
                  label="Claimant Signature"
                  InputElem={
                    <Text fontWeight="400" fontSize="14px" color="gray.500">
                      {lienWaiverData.claimantTitle || 'Null'}
                    </Text>
                  }
                />
              </HStack>
            </VStack>
          </VStack>
        </FormControl>

        <Box>
          <Divider borderColor=" #E2E8F0" borderWidth="1px" />
        </Box>
        <Flex justifyContent="end" my="16px" mx="32px">
          <Box>
            <Link href={leanwieverLink} target={'_blank'} color="#4E87F8">
              <Button colorScheme="brand" variant="outline" leftIcon={<BiDownload size={14} />}>
                See LW{`${lienWaiverData.id}`}
              </Button>
            </Link>
          </Box>
          <Spacer />
          <HStack spacing="16px">
            <Button colorScheme="brand" onClick={() => SetClicked(true)}>
              <InformationCard clicked={clicked} />
            </Button>
            <Button onClick={onClose} colorScheme="brand" variant="outline">
              {t('cancel')}
            </Button>
          </HStack>
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
