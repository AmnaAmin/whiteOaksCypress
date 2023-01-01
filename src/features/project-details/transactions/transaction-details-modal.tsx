import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Box,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ModalProps,
  Heading,
  VStack,
  Flex,
  Grid,
  GridItem,
  ModalCloseButton,
  useMediaQuery,
} from '@chakra-ui/react'
import { useTransaction } from 'api/transactions'
import { BiCalendar, BiUser } from 'react-icons/bi'
import { dateFormat } from 'utils/date-time-utils'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { TRANSACTION } from './transactions.i18n'

type CustomModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>
type AddNewTransactionProps = CustomModalProps & {
  selectedTransactionId: number
}

const InfoCard: React.FC<{
  title: string
  subTitle: string
  Icon?: React.ElementType
}> = ({ title, subTitle, Icon }) => {
  return (
    <Flex>
      <Flex direction="column">
        <Heading color="gray.700" fontWeight={500} fontSize="14px" whiteSpace="nowrap" mb="2">
          {title}
        </Heading>
        <Text
          color="gray.600"
          fontWeight="400"
          fontSize="14px"
          isTruncated
          display="inline-block"
          title={subTitle}
          maxW="112px"
        >
          {subTitle}
        </Text>
      </Flex>
    </Flex>
  )
}

export const TransactionDetailsModal: React.FC<AddNewTransactionProps> = ({
  isOpen,
  onClose,
  selectedTransactionId,
}) => {
  const { t } = useTranslation()
  const { transaction } = useTransaction(selectedTransactionId)
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const [modalSize, setModalSize] = useState<string>('3xl')

  useEffect(() => {
    if (isMobile) {
      setModalSize('sm')
    } else {
      setModalSize('3xl')
    }
  }, [isMobile])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader
          bg="gray.50"
          borderBottom="1px solid #eee"
          fontSize="16px"
          fontWeight={500}
          color="gray.00"
          outline={'1px solid red'}
        >
          {transaction?.name}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />

        <ModalBody px="6" py="8">
          <VStack alignItems="left" mt="5">
            <Grid templateColumns="repeat(5,1fr)" pb={6} borderBottom="1px solid #E2E8F0" mb="14">
              <GridItem>
                <InfoCard
                  title={t(`${TRANSACTION}.transactionType`)}
                  subTitle={transaction?.transactionTypeLabel as string}
                />
              </GridItem>
              <GridItem>
                <InfoCard
                  title={t(`${TRANSACTION}.dateCreated`)}
                  subTitle={dateFormat(transaction?.createdDate as string)}
                  Icon={BiCalendar}
                />
              </GridItem>
              <GridItem>
                <InfoCard
                  title={t(`${TRANSACTION}.createdBy`)}
                  subTitle={transaction?.createdBy as string}
                  Icon={BiUser}
                />
              </GridItem>
              <GridItem>
                <InfoCard
                  title={t(`${TRANSACTION}.dateModified`)}
                  subTitle={dateFormat(transaction?.modifiedDate as string)}
                  Icon={BiCalendar}
                />
              </GridItem>
              <GridItem>
                <InfoCard
                  title={t(`${TRANSACTION}.modifiedBy`)}
                  subTitle={transaction?.modifiedBy as string}
                  Icon={BiUser}
                />
              </GridItem>
            </Grid>
          </VStack>

          <Text mb="4" fontSize="14px" fontWeight={500} color="gray.600" ml="4">
            Items:
          </Text>
          <Box border="1px solid #efefef" h="300px" overflow="auto" ml="4" mr="4">
            <Table colorScheme="gray">
              <Thead bg="gray.50">
                <Tr>
                  <Th fontSize="14px" fontWeight={500} color="gray.600" textTransform="capitalize">
                    {t(`${TRANSACTION}.description`)}
                  </Th>
                  <Th fontSize="14px" fontWeight={500} color="gray.600" textTransform="capitalize">
                    {t(`${TRANSACTION}.amount`)}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {transaction?.lineItems?.map(t => {
                  const amount = Number(t.whiteoaksCost) || Number(t.vendorCost)
                  return (
                    <Tr key={t.id}>
                      <Td color="gray.500" fontWeight={400} fontSize="14px">
                        {t.description}
                      </Td>
                      <Td color="gray.500" fontWeight={400} fontSize="14px">
                        {amount < 0 ? `-$${Math.abs(amount)}` : `$${amount}`}
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button onClick={onClose} colorScheme="darkPrimary">
            {t(`${TRANSACTION}.close`)}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
