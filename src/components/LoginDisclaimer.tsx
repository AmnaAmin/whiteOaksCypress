import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Image,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { SignatureDocument } from 'api/sign-agreement'
import SignatureModal from 'features/vendor/vendor-work-order/lien-waiver/signature-modal'
import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue, BiTrash } from 'react-icons/bi'
import { dateFormatNew } from 'utils/date-time-utils'
import { imgUtility } from 'utils/file-utils'
import { FormInput } from './react-hook-form-fields/input'

interface DisclaimerModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: any
  onConfirm: (data: SignatureDocument) => void
}

type FormValueType = {
  claimantsSignature: any
  dateOfSignature: string | Date | null | undefined
}

export function DisclaimerModal({ isOpen, isLoading = false, onClose, onConfirm }: DisclaimerModalProps) {
  const { t } = useTranslation();
  const [openSignature, setOpenSignature] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sigRef = useRef<HTMLImageElement>(null)
  const [claimantsSignature, setClaimantsSignature] = useState('')
  const [document, setDocument] = useState({});

  const convertSignatureTextToImage = value => {
    const uri = imgUtility.generateTextToImage(canvasRef, value)
    setDocument({
      fileObject: uri?.split(',')[1],
      fileObjectContentType: 'image/png',
      fileType: 'Claimants-Signature.png',
    })
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

  const {
    register,
    setValue,
    control,
  } = useForm<FormValueType>({
    defaultValues: {

      claimantsSignature: null,
      dateOfSignature: ''
    },
  })
  const formValues = useWatch({ control })

  return (
    <>
      <SignatureModal setSignature={onSignatureChange} open={openSignature} onClose={() => setOpenSignature(false)} />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size={'5xl'}
      >
        <ModalOverlay />
        <ModalContent rounded="6">
          <ModalHeader
            borderBottom="2px solid #E2E8F0"
            fontWeight={500}
            color="gray.600"
            fontSize="16px"
            fontStyle="normal"
            mb="5"
          >
            {'Disclaimer: Proprietary Software Usage'}
          </ModalHeader>
          <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />
          <ModalBody>
            <Text
              data-testid="disclaimer-message"
              color="#2D3748"
              fontSize="16px"
              fontWeight={400}
              fontStyle="normal"
              mb="2"
              p="10px"
              h="450px"
              overflowY={'scroll'}
              paddingLeft={'20px'}
            >
              <p>
                Please read this disclaimer carefully before accessing or using the proprietary software ("Software"). By
                accessing or using the Software, you agree to comply with the terms and conditions outlined in this
                disclaimer. If you do not agree with these terms, refrain from using the Software.
              </p>
              &nbsp;
              <ul>
                <li>
                  No Personal Use or Unauthorized Access: The Software is intended solely for authorized users in
                  compliance with applicable laws and regulations. It is strictly prohibited to download, install, or use
                  the Software for personal use or any other unauthorized purposes. Non-Disclosure Agreement (NDA): The
                  Software may be protected by a Non-Disclosure Agreement. Unauthorized disclosure, reproduction,
                  distribution, or sharing of any part of the Software is strictly prohibited. Violation of the NDA may
                  result in legal consequences.
                </li>
                <li>
                  Non-Compete Clause: The use of the Software may be subject to a non-compete clause, which prohibits
                  users from developing, distributing, or using similar software or technology that competes with the
                  Software. Users must comply with this clause to avoid potential legal ramifications.
                </li>
                <li>
                  Compliance with Applicable Laws: Users must use the Software in compliance with all applicable local,
                  national, and international laws, rules, and regulations. Any unlawful or unauthorized use of the
                  Software is strictly prohibited and may result in legal action.
                </li>
                <li>
                  Intellectual Property Rights: The Software and all associated intellectual property rights, including
                  but not limited to copyright, trademarks, and patents, are owned by the respective owner(s). Users are
                  prohibited from infringing upon these rights or engaging in any unauthorized use or modification of the
                  Software.
                </li>
                <li>
                  Limitation of Liability: In no event shall the owner(s) of the Software be liable for any direct,
                  indirect, incidental, consequential, or special damages arising out of or in connection with the use or
                  inability to use the Software.
                </li>
              </ul>
              &nbsp;
              <p>
                By accessing or using the Software, you acknowledge and agree to be bound by the terms and conditions of
                this disclaimer. If you do not agree with any provision of this disclaimer, refrain from accessing or
                using the Software.
              </p>
            </Text>
            <Grid
              templateColumns={{
                base: 'repeat(auto-fill,minmax(215px ,1fr))',
                md: 'repeat(auto-fill,minmax(215px ,0fr))',
              }}
              gap={10}
              mt={8}
            >
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
                    data-testid='agreeDisclaimerSign'
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
                          data-testid="removeSignature"
                          onClick={e => {
                            onRemoveSignature();
                            e.stopPropagation()
                          }}
                        >
                          <BiTrash className="mr-1" color="#A0AEC0" />
                        </IconButton>
                      )}
                    </HStack>
                  </Button>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormInput
                  errorMessage=''
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
                  readOnly
                />
              </GridItem>
            </Grid>
          </ModalBody>
          <Flex flexFlow="row-reverse">
            <ModalFooter>
              <Button colorScheme="brand" data-testid="confirmation-no" variant="outline" mr={3} onClick={onClose}>
                {'Cancel'}
              </Button>

              <Button
                size="md"
                onClick={() => {
                  let doc: any = document;
                  onConfirm({
                    fileObject: doc.fileObject,
                    fileObjectContentType: doc.fileObjectContentType,
                    fileType: doc.fileType
                  })
                }}
                isLoading={isLoading}
                colorScheme="brand"
                rounded="6px"
                fontSize="14px"
                data-testid="agreeDisclaimer"
                fontWeight={500}
                w="6px"
                disabled={claimantsSignature === ''}
              >
                I Agree
              </Button>
            </ModalFooter>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}
