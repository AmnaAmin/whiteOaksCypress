import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
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
} from '@chakra-ui/react'
import { useTransaction } from 'utils/transactions'
import { BiCalendar, BiUser } from 'react-icons/bi'
import { dateFormat } from 'utils/date-time-utils'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'

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
      {Icon && <Box mr="15px">{<Icon fontSize="20px" fill="#718096" />}</Box>}
      <Flex direction="column">
        <Heading color="gray.700" fontWeight={700} fontSize="16px">
          {title}
        </Heading>
        <Text color="gray.600" fontWeight="400" fontSize="14px">
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent minH="700px">
        <ModalHeader
          bg="gray.50"
          borderBottom="1px solid #eee"
          fontSize="18px"
          fontWeight={700}
          color="gray.700"
        >
          {transaction?.name}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />

        <ModalBody px="6" py="8">
          <VStack
            alignItems="left"
            mb="5"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.100"
            borderRadius={10}
            boxShadow="sm"
          >
            <Box borderBottom="1px solid" borderColor="gray.200" p={7}>
              <InfoCard
                title={t('transactionType')}
                subTitle={transaction?.transactionTypeLabel as string}
              />
            </Box>

            <Grid
              templateColumns="215px 1fr"
              rowGap={7}
              columnGap={12}
              px={7}
              pb={12}
            >
              <GridItem borderBottom="1px solid" borderColor="gray.200" py={7}>
                <InfoCard
                  title={t('dateCreated')}
                  subTitle={dateFormat(transaction?.createdDate as string)}
                  Icon={BiCalendar}
                />
              </GridItem>
              <GridItem borderBottom="1px solid" borderColor="gray.200" py={7}>
                <InfoCard
                  title={t('createdBy')}
                  subTitle={transaction?.createdBy as string}
                  Icon={BiUser}
                />
              </GridItem>
              <GridItem borderBottom="1px solid" borderColor="gray.200" py={7}>
                <InfoCard
                  title={t('dateModified')}
                  subTitle={dateFormat(transaction?.modifiedDate as string)}
                  Icon={BiCalendar}
                />
              </GridItem>
              <GridItem borderBottom="1px solid" borderColor="gray.200" py={7}>
                <InfoCard
                  title={t('modifiedBy')}
                  subTitle={transaction?.modifiedBy as string}
                  Icon={BiUser}
                />
              </GridItem>
            </Grid>
          </VStack>

          <Box border="1px solid #efefef" h="300px" overflow="auto">
            <Table colorScheme="gray">
              <Thead bg="gray.50">
                <Tr>
                  <Th
                    fontSize="12px"
                    fontWeight={700}
                    color="gray.700"
                    textTransform="capitalize"
                  >
                    {t('description')}
                  </Th>
                  <Th
                    fontSize="12px"
                    fontWeight={700}
                    color="gray.700"
                    textTransform="capitalize"
                  >
                    {t('amount')}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {transaction?.lineItems?.map(t => {
                  const amount = Number(t.whiteoaksCost) || Number(t.vendorCost)
                  return (
                    <Tr key={t.id}>
                      <Td color="gray.700" fontWeight={400} fontSize="14px">
                        {t.description}
                      </Td>
                      <Td color="gray.700" fontWeight={400} fontSize="14px">
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
          <Button onClick={onClose} colorScheme="button">
            {t('close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
