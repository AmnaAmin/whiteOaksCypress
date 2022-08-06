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
} from '@chakra-ui/react'
import InputView from 'components/input-view/input-view'
import { orderBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiCaretDown, BiCaretUp, BiDownload } from 'react-icons/bi'
import { GetHelpText } from 'utils/lien-waiver'
import { useTranslation } from 'react-i18next'
import { dateFormatter } from 'utils/date-time-utils'
import { defaultValuesLienWaiver } from 'utils/work-order'

export const LienWaiverTab: React.FC<any> = props => {
  const { t } = useTranslation()
  const { lienWaiverData, onClose, documentsData, onSave } = props
  const [documents, setDocuments] = useState<any[]>([])

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaultValuesLienWaiver(lienWaiverData),
  })
  const { leanwieverLink } = props.lienWaiverData

  const onSubmit = formValues => {
    onSave({
      ...formValues,
      documents,
    })
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
    const signatureDoc = orderDocs.find(doc => parseInt(doc.documentType, 10) === 108)

    setClaimantsSignature(signatureDoc?.s3Url ?? '')
  }, [documentsData, setValue, lienWaiverData])

  return (
    <Box>
      <form className="lienWaver" id="lienWaverForm" onSubmit={handleSubmit(onSubmit)}>
        <ModalBody h="400px" overflow={'auto'}>
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
                    InputElem={lienWaiverData.claimantName.toString()}
                  />

                  <InputView
                    controlStyle={{ w: '207px' }}
                    label={t('jobLocation')}
                    InputElem={lienWaiverData.propertyAddress}
                  />
                </HStack>

                <HStack spacing="16px">
                  <InputView
                    controlStyle={{ w: '207px' }}
                    label={t('makerOfCheck')}
                    InputElem={lienWaiverData.makerOfCheck}
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
                        {...register('amountOfCheck')}
                        h="35px"
                        m={0}
                        pl={2}
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight={400}
                        color="gray.500"
                        isDisabled={props.rejectChecked}
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
                      <>{lienWaiverData.dateOfSignature ? dateFormatter(lienWaiverData.dateOfSignature) : 'mm/dd/yy'}</>
                    }
                  />
                  <InputView
                    controlStyle={{ w: '207px' }}
                    label="Claimant Signature"
                    InputElem={
                      claimantsSignature ? (
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
          <Flex justifyContent="start" w="100%">
            {lienWaiverData.lienWaiverAccepted && (
              <Box>
                <Link href={leanwieverLink} target={'_blank'} color="#4E87F8">
                  <Button colorScheme="brand" variant="outline" leftIcon={<BiDownload size={14} />}>
                    See LW{`${lienWaiverData.id}`}
                  </Button>
                </Link>
              </Box>
            )}
          </Flex>
          <HStack spacing="16px" justifyContent="end">
            {!lienWaiverData.lienWaiverAccepted && (
              <Button onClick={onClose} colorScheme="brand">
                {t('cancel')}
              </Button>
            )}
            {lienWaiverData.lienWaiverAccepted && (
              <>
                <Button onClick={onClose} colorScheme="brand" variant="outline">
                  {t('cancel')}
                </Button>
                <Button type="submit" colorScheme="brand" isDisabled={props.rejectChecked}>
                  {t('save')}
                </Button>
              </>
            )}
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
