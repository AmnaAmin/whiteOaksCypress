import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { convertImageToDataURL, trimCanvas } from 'components/table/util'
import { dateFormat } from 'utils/date-time-utils'
import { downloadFile } from 'utils/file-utils'
import jsPdf from 'jspdf'
import { orderBy } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { BiBookAdd, BiCalendar, BiCaretDown, BiCaretUp, BiTrash } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import { FormInput } from 'components/react-hook-form-fields/input'
import { createForm, getHelpText } from 'utils/lien-waiver'
import { useDocuments } from 'utils/vendor-projects'

import SignatureModal from 'features/projects/modals/signature-modal'
import { useTranslation } from 'react-i18next'

type LienWaiverProps = {
  onClose?: () => void
}

export const DrawLienWaiver: React.FC<LienWaiverProps> = props => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { documents: documentsData = [] } = useDocuments({
    projectId,
  })
  const [recentLWFile, setRecentLWFile] = useState<any>(null)
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useFormContext()

  const formValues = useWatch({ name: 'lienWaiver', control })

  useEffect(() => {
    if (!documentsData?.length) return
    const orderDocs = orderBy(documentsData, ['modifiedDate'], ['desc'])
    const signatureDoc = orderDocs.find(doc => parseInt(doc.documentType, 10) === 108)
    const recentLW = orderDocs.find(doc => parseInt(doc.documentType, 10) === 26)
    setRecentLWFile(recentLW)
    setValue('lienWaiver.claimantsSignature', signatureDoc?.s3Url)
  }, [documentsData, setValue])

  const generatePdf = useCallback(() => {
    let form = new jsPdf()
    const value = getValues()
    const dimention = {
      width: sigRef?.current?.width,
      height: sigRef?.current?.height,
    }
    convertImageToDataURL(value.claimantsSignature, (dataUrl: string) => {
      form = createForm(form, getValues(), dimention, dataUrl)
      //   const pdfUri = form.output('datauristring')
      const pdfBlob = form.output('bloburi')
      setRecentLWFile({
        s3Url: pdfBlob,
        fileType: 'Lien-Waiver-Form.pdf',
      })
    })
  }, [getValues])

  const generateTextToImage = value => {
    const context = canvasRef?.current?.getContext('2d')

    if (!context) return

    context.clearRect(0, 0, canvasRef?.current?.width ?? 0, canvasRef?.current?.height ?? 0)
    context.font = 'italic 500 12px Inter'
    context.textAlign = 'start'
    context.fillText(value, 5, 10)
    const trimContext = trimCanvas(canvasRef.current)

    const uri = trimContext?.toDataURL('image/png')

    setValue('lienWaiver.claimantsSignature', uri)
  }

  const onSignatureChange = value => {
    generateTextToImage(value)
    setValue('lienWaiver.dateOfSignature', dateFormat(new Date()))
  }

  const onRemoveSignature = () => {
    setValue('lienWaiver.claimantsSignature', null)
    setValue('lienWaiver.dateOfSignature', null)
  }

  return (
    <Stack>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />

      {/* <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onSubmit)}> */}
      <FormControl>
        <VStack align="start" spacing="30px">
          <Flex w="100%" alignContent="space-between" pos="relative">
            <Box flex="4">
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
                    onClick={() => downloadFile(recentLWFile?.s3Url)}
                  >
                    <Box pos="relative" right="6px"></Box>
                    {recentLWFile?.fileType}
                  </Button>
                </Flex>
              )}

              <Button
                bg="#4E87F8"
                disabled={!formValues.claimantsSignature || recentLWFile}
                color="#FFFFFF"
                float="right"
                size="md"
                _hover={{ bg: 'royalblue' }}
                onClick={generatePdf}
              >
                <Box pos="relative" right="6px"></Box>
                Generate LW
              </Button>
            </Flex>
          </Flex>
          <Box>
            <VStack alignItems="start">
              <HStack>
                <InputView
                  controlStyle={{ w: '20em' }}
                  label={t('nameofClaimant')}
                  InputElem={<Text>{formValues.claimantName}</Text>}
                />

                <InputView
                  controlStyle={{ w: '20em' }}
                  label={t('jobLocation')}
                  InputElem={<Text>{formValues.propertyAddress}</Text>}
                />
              </HStack>
              <HStack></HStack>
              <HStack>
                <InputView
                  controlStyle={{ w: '20em' }}
                  label={t('makerOfCheck')}
                  InputElem={<Text>{formValues.makerOfCheck}</Text>}
                />
                <InputView
                  controlStyle={{ w: '20em' }}
                  label={t('amountOfCheck')}
                  InputElem={<Text>{formValues.amountOfCheck}</Text>}
                />
              </HStack>

              <Stack pt="5" pb="5">
                <FormInput
                  testId="claimants-title"
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
                  name={`lienWaiver.claimantTitle`}
                />
              </Stack>

              <HStack alignItems={'flex-start'} spacing="7">
                <FormControl isInvalid={!formValues.claimantsSignature} width={'20em'}>
                  <FormLabel fontWeight={500} fontSize="14px" color="gray.600">
                    {t('claimantsSignature')}
                  </FormLabel>
                  <Flex pos="relative" bg="gray.50" height={'37px'} alignItems={'center'} px={4}>
                    <canvas hidden ref={canvasRef} height={'64px'} width={'1000px'}></canvas>
                    <Image
                      data-testid="signature-img"
                      hidden={!formValues.claimantsSignature}
                      maxW={'100%'}
                      src={formValues.claimantsSignature as string}
                      {...register('lienWaiver.claimantsSignature', {
                        required: 'This is required field',
                      })}
                      ref={sigRef}
                    />

                    <Flex pos={'absolute'} right="10px" top="11px">
                      {formValues.claimantsSignature && (
                        <BiTrash className="mr-1" onClick={onRemoveSignature} color="#A0AEC0" />
                      )}
                      <BiBookAdd data-testid="add-signature" onClick={() => setOpenSignature(true)} color="#A0AEC0" />
                    </Flex>
                  </Flex>
                  {!formValues.claimantsSignature && <FormErrorMessage>This is required field</FormErrorMessage>}
                </FormControl>

                <FormInput
                  testId="signature-date"
                  icon={<BiCalendar />}
                  errorMessage={errors.dateOfSignature && errors.dateOfSignature?.message}
                  label={t('dateOfSignature')}
                  placeholder=""
                  register={register}
                  name={`lienWaiver.dateOfSignature`}
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
      <Divider />
      {/* <ModalFooter mt={3}>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            size="lg"
            color="gray.700"
            fontStyle="normal"
            fontWeight={500}
            fontSize="14px"
          >
            {t('close')}
          </Button>
          <Button
            colorScheme="CustomPrimaryColor"
            size="lg"
            mr={3}
            type="submit"
            fontStyle="normal"
            fontWeight={500}
            fontSize="14px"
          >
            {t('save')}
          </Button>
        </ModalFooter> */}
      {/* </form> */}
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
