import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Link,
  Stack,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Grid,
  GridItem,
  Button,
  Spacer,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import trimCanvas from 'trim-canvas'
import { dateFormat } from 'utils/date-time-utils'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { BiBookAdd, BiCalendar, BiCaretDown, BiCaretUp, BiTrash } from 'react-icons/bi'
import { FormInput } from 'components/react-hook-form-fields/input'
import { GetHelpText } from 'utils/lien-waiver'

import SignatureModal from 'features/vendor/vendor-work-order/lien-waiver/signature-modal'
import { useTranslation } from 'react-i18next'
import { TRANSACTION } from './transactions.i18n'

type LienWaiverProps = {
  onClose?: () => void
}

export const LienWaiverAlert = () => {
  const { t } = useTranslation()

  return (
    <Alert status="info" variant="custom" size="sm">
      <AlertIcon />
      <AlertDescription>{t('LWrequired')}</AlertDescription>
      <CloseButton alignSelf="flex-start" position="absolute" right={2} top={2} size="sm" />
    </Alert>
  )
}

export const ProjectAwardAlert = () => {
  const { t } = useTranslation()

  return (
    <Alert status="info" variant="custom" size="sm">
      <AlertIcon />
      <AlertDescription>{t('AwardRq')}</AlertDescription>
      <CloseButton alignSelf="flex-start" position="absolute" right={2} top={2} size="sm" />
    </Alert>
  )
}

export const ProjectTransactionRemainingALert = ({ msg, onOpen, isUpgradeProjectAward }: any) => {
  const { t } = useTranslation()

  return (
    <Alert mt={2} status="info" variant="custom" size="sm">
      <AlertIcon />
      <AlertDescription maxW="90%">{t(`${msg}`)}</AlertDescription>
      <Spacer />
      {isUpgradeProjectAward ? (
        <Button variant="outline" colorScheme="brand" onClick={onOpen}>
          Upgrade
        </Button>
      ) : null}
    </Alert>
  )
}

export const DrawLienWaiver: React.FC<LienWaiverProps> = props => {
  const { t } = useTranslation()
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)

  const {
    register,
    formState: { errors },
    setValue,
    control,
  } = useFormContext()

  const formValues = useWatch({ name: 'lienWaiver', control })

  useLayoutEffect(() => {
    setTimeout(() => {
      setValue('lienWaiver.signatureWidth', sigRef.current?.width)
      setValue('lienWaiver.signatureHeight', sigRef.current?.height)
    }, 100)
  }, [formValues?.claimantsSignature])

  const generateTextToImage = value => {
    const context = canvasRef?.current?.getContext('2d')

    if (!context || !canvasRef.current) return
    canvasRef.current.width = 1000
    canvasRef.current.height = 64

    context.clearRect(0, 0, canvasRef?.current?.width ?? 0, canvasRef?.current?.height ?? 0)
    context.font = 'italic 500 14px Arial'
    context.textAlign = 'start'
    context.fillText(value, 10, 50)
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

      <VStack align="start" spacing="30px" h="560px" overflowY="auto">
        <Flex w="100%" alignContent="space-between" pos="relative" my="7">
          <Box flex="4">
            <HelpText>{GetHelpText()}</HelpText>
          </Box>
        </Flex>

        <Grid templateColumns="215px 215px" gap="40px 80px" w="100%">
          <GridItem>
            <InputView label={t(`${TRANSACTION}.nameofClaimant`)} InputElem={<Text>{formValues?.claimantName}</Text>} />
          </GridItem>

          <GridItem>
            <InputView label={t(`${TRANSACTION}.jobLocation`)} InputElem={<Text>{formValues?.propertyAddress}</Text>} />
          </GridItem>

          <GridItem>
            <InputView label={t(`${TRANSACTION}.makerOfCheck`)} InputElem={<Text>{formValues?.makerOfCheck}</Text>} />
          </GridItem>
          <GridItem>
            <InputView label={t(`${TRANSACTION}.amountOfCheck`)} InputElem={<Text>{formValues?.amountOfCheck}</Text>} />
          </GridItem>

          <GridItem>
            <FormInput
              testId="claimants-title"
              errorMessage={errors.claimantTitle && errors.claimantTitle?.message}
              label={t(`${TRANSACTION}.claimantsTitle`)}
              placeholder=""
              register={register}
              elementStyle={{
                bg: 'white',
                borderLeft: '2px solid #4E87F8',
              }}
              rules={{ required: 'This is required field' }}
              name={`lienWaiver.claimantTitle`}
            />
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!formValues?.claimantsSignature}>
              <FormLabel fontWeight={500} fontSize="14px" color="gray.600">
                {t(`${TRANSACTION}.claimantsSignature`)}
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
                onClick={() => setOpenSignature(true)}
              >
                <canvas hidden ref={canvasRef} height={'64px'} width={'1000px'}></canvas>
                <Image
                  data-testid="signature-img"
                  hidden={!formValues?.claimantsSignature}
                  maxW={'100%'}
                  src={formValues?.claimantsSignature as string}
                  {...register('lienWaiver.claimantsSignature', {
                    required: 'This is required field',
                  })}
                  ref={sigRef}
                />

                <Flex pos={'absolute'} right="10px" top="11px">
                  {formValues?.claimantsSignature && (
                    <BiTrash
                      className="mr-1"
                      onClick={e => {
                        onRemoveSignature()
                        e.stopPropagation()
                      }}
                      color="#A0AEC0"
                    />
                  )}
                  <BiBookAdd data-testid="add-signature" color="#A0AEC0" />
                </Flex>
              </Button>
              {errors?.lienWaiver?.claimantsSignature?.message && (
                <FormErrorMessage>This is required field</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormInput
              testId="signature-date"
              icon={<BiCalendar />}
              errorMessage={errors.dateOfSignature && errors.dateOfSignature?.message}
              label={t(`${TRANSACTION}.dateOfSignature`)}
              placeholder=""
              register={register}
              name={`lienWaiver.dateOfSignature`}
              elementStyle={{
                bg: 'white',
                borderWidth: '0 0 1px 0',
                borderColor: 'gray.100',
                rounded: '0',
              }}
              rules={{ required: 'This is required field' }}
              readOnly
            />
          </GridItem>
        </Grid>
      </VStack>
      <Divider />
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
            <Box>{t(`${TRANSACTION}.readMore`)}</Box>
            <Box ml="3px" mt="3px">
              <BiCaretDown />
            </Box>
          </Flex>
        </Link>
      ) : (
        <Link onClick={toggleReadMore}>
          <Flex fontStyle="normal" fontWeight={500} fontSize="14px" style={{ color: '#4A5568' }}>
            <Box>{t(`${TRANSACTION}.readLess`)}</Box>
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
