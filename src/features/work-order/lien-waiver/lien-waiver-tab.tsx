import {
  Box,
  Button,
  ModalBody,
  Flex,
  FormControl,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  ModalFooter,
  Stack,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { orderBy } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BiCaretDown, BiCaretUp, BiDownload, BiSpreadsheet, BiUpload } from 'react-icons/bi'
import { GetHelpText } from 'utils/lien-waiver'
import { useTranslation } from 'react-i18next'
import { dateFormat } from 'utils/date-time-utils'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import { MdOutlineCancel } from 'react-icons/md'
import { head } from 'lodash'
import { readFileContent } from 'api/vendor-details'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { STATUS as WOstatus } from 'features/common/status'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { workOrder, onClose, documentsData, onSave, navigateToProjectDetails } = props
  const [documents, setDocuments] = useState<any[]>([])
  const { isDoc, isProjectCoordinator } = useUserRolesSelector()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [first, last] = workOrder?.companyName?.split(' ') || []
  const { mutate: updateLienWaiver } = useUpdateWorkOrderMutation({})

  const { register, handleSubmit, setValue, control } = useForm({
    // defaultValues: defaultValuesLienWaiver(workOrder),
  })
  const { leanwieverLink } = props.workOrder

  const document = useWatch({ name: 'uploadLW', control })

  const onSubmit = formValues => {
    onSave({
      ...formValues,
      documents,
    })
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

  const parseValuesToPayload = async () => {
    const fileContents = await readFileContent(document as File)
    return {
      ...workOrder,
      lienWaiverAccepted: true,
      amountOfCheck: workOrder.finalInvoiceAmount,
      documents: [
        {
          documentType: 26,
          workOrderId: workOrder.id,
          fileObject: fileContents,
          fileObjectContentType: document.type,
          fileType: `LW${workOrder?.id ?? ''}_${head(first) ?? ''}${head(last) ?? ''}.pdf`,
        },
      ],
    }
  }

  const [claimantsSignature, setClaimantsSignature] = useState('')

  useEffect(() => {
    if (!documentsData?.length) return
    setDocuments(documentsData)

    const orderDocs = orderBy(
      documentsData,
      [
        item => {
          if (item?.createdDate) {
            const createdDate = new Date(item?.createdDate)
            return createdDate
          }
        },
      ],
      ['desc'],
    )
    const signatureDoc = orderDocs.find(
      doc => parseInt(doc.documentType, 10) === 108 && workOrder.id === doc.workOrderId,
    )

    setClaimantsSignature(signatureDoc?.s3Url ?? '')
  }, [documentsData, setValue, workOrder])

  const toast = useToast()
  const lwUpload = async () => {
    const payload = await parseValuesToPayload()
    updateLienWaiver(payload, {
      onSuccess() {
        toast({
          title: t('uploadFile'),
          description: t('isUploadedSuccessfully'),
          status: 'success',
          isClosable: true,
        })
      },
    })
  }

  return (
    <Box>
      <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onSubmit)}>
        <ModalBody h={'calc(100vh - 300px)'} overflow={'auto'}>
          <FormControl>
            <VStack align="start" spacing="30px" m="32px">
              <Flex w="100%" alignContent="space-between" pos="relative">
                <Box flex="4" minW="59em">
                  <HelpText>{GetHelpText()}</HelpText>
                </Box>
              </Flex>

              <VStack alignItems="start" spacing="32px">
                <HStack spacing="16px">
                  <InputView
                    controlStyle={{ w: '207px' }}
                    label={t('nameofClaimant')}
                    InputElem={workOrder?.claimantName?.toString()}
                  />

                  <InputView
                    controlStyle={{ w: '207px' }}
                    label={t('jobLocation')}
                    InputElem={workOrder?.propertyAddress}
                  />
                </HStack>

                <HStack spacing="16px">
                  <InputView
                    controlStyle={{ w: '207px' }}
                    label={t('makerOfCheck')}
                    InputElem={workOrder?.makerOfCheck}
                  />

                  <Stack pt={6}>
                    <Heading color="gray.600" fontSize="14px" fontWeight={500} isTruncated>
                      {t('amountOfCheck')}
                    </Heading>

                    <InputGroup p={0}>
                      <InputLeftElement
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={400}
                        color="gray.500"
                        p={0}
                        h="35px"
                        w={2}
                        children="$"
                      />

                      <Input
                        {...register('finalInvoiceAmount')}
                        h="35px"
                        m={0}
                        pl={2}
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={400}
                        color="gray.500"
                        isDisabled={true} // {props.rejectChecked}
                        variant="flushed"
                        borderColor="gray.100"
                      />
                    </InputGroup>
                  </Stack>
                </HStack>

                <HStack spacing="16px">
                  <InputView
                    controlStyle={{ w: '207px' }}
                    label="Date of signature"
                    InputElem={
                      <>
                        {workOrder?.lienWaiverAccepted && workOrder?.dateOfSignature
                          ? dateFormat(workOrder?.dateOfSignature)
                          : 'mm/dd/yy'}
                      </>
                    }
                  />
                  <InputView
                    controlStyle={{ w: '207px' }}
                    label="Claimant Signature"
                    InputElem={
                      workOrder?.lienWaiverAccepted && claimantsSignature ? (
                        <Image hidden={!claimantsSignature} maxW={'100%'} src={claimantsSignature} />
                      ) : (
                        <></>
                      )
                    }
                  />
                </HStack>
              </VStack>
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <HStack justifyContent="start" w="100%">
            {workOrder?.lienWaiverAccepted && (
              <Box>
                <Link href={leanwieverLink} target={'_blank'} color="#4E87F8" download={leanwieverLink}>
                  <Button colorScheme="brand" variant="outline" leftIcon={<BiDownload size={14} />}>
                    See LW{`${workOrder?.id}`}
                  </Button>
                </Link>
              </Box>
            )}
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

            <input
              type="file"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={onFileChange}
              accept="application/pdf, image/png, image/jpg, image/jpeg"
            />

            {(isDoc || isProjectCoordinator) &&
              [WOstatus.Declined, WOstatus.Completed].includes(workOrder?.statusLabel?.toLocaleLowerCase()) &&
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

          <HStack justifyContent="end">
            <Button onClick={onClose} colorScheme="brand" variant="outline">
              {t('cancel')}
            </Button>
            <Button onClick={() => lwUpload()} colorScheme="brand" isDisabled={!document}>
              {t('save')}
            </Button>
            {/*!workOrder?.lienWaiverAccepted && (
              <Button onClick={onClose} colorScheme="brand">
                {t('cancel')}
              </Button>
            )}
            {workOrder?.lienWaiverAccepted && (
              <>
                <Button onClick={onClose} colorScheme="brand" variant="outline">
                  {t('cancel')}
                </Button>
                <Button type="submit" colorScheme="brand" isDisabled={props.rejectChecked}>
                  {t('save')}
                </Button>
              </>
            )*/}
          </HStack>
        </ModalFooter>
      </form>
    </Box>
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
        <Button variant="link" color="#4A5568" onClick={toggleReadMore} rightIcon={<BiCaretDown />}>
          {t('readMore')}
        </Button>
      ) : (
        <Button colorScheme="brand" variant="link" onClick={toggleReadMore} rightIcon={<BiCaretUp />}>
          {t('readLess')}
        </Button>
      )}
      {isReadMore && (
        <Box mt="28px" className="text">
          {text}
        </Box>
      )}
    </>
  )
}
