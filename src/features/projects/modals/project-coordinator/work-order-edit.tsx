import React, { useCallback, useEffect, useState } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Divider,
  HStack,
  TagLabel,
  Tag,
  Box,
  Flex,
} from '@chakra-ui/react'
import { ProjectType, ProjectWorkOrderType } from 'types/project.type'
import { LienWaiverTab } from './lien-waiver-tab'
import { useTranslation } from 'react-i18next'
// import WorkOrderDetailTab from './work-order-edit-tab'
import PaymentInfoTab from './payment-tab-pc'
import { InvoiceTabPC } from './invoice-tab-pc'
import WorkOrderDetailTab from './work-order-edit-tab'

const WorkOrderDetails = ({
  projectData,
  workOrder,
  onClose: close,
}: {
  projectData: ProjectType
  workOrder: ProjectWorkOrderType
  onClose: () => void
}) => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (workOrder) {
      onOpen()
    } else {
      onCloseDisclosure()
      setTabIndex(0)
    }
  }, [onCloseDisclosure, onOpen, workOrder])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />

      <ModalContent rounded={3} borderTop="2px solid #4E87F8">
        <ModalHeader>
          {tabIndex === 4 && (
            <Box>
              <HStack fontSize="16px" fontWeight={500}>
                <Text borderRight="2px solid black" color="#4E87F8" lineHeight="22px" h="22px" pr={2}>
                  Invoice # 432022
                </Text>
                <Text lineHeight="22px" h="22px">
                  ADT RENOVATIONS
                </Text>
              </HStack>
            </Box>
          )}

          {tabIndex !== 4 && (
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500}>
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  WO {workOrder?.id}
                </Text>
                <Text lineHeight="22px" h="22px">
                  {workOrder?.companyName}
                </Text>
              </HStack>

              <Tag size="lg" rounded="6px" variant="solid" color="#2AB450" bg="#E7F8EC">
                <TagLabel fontSize="16px" fontStyle="normal" fontWeight={500} lineHeight="24px">
                  {workOrder?.statusLabel}
                </TagLabel>
              </Tag>
            </HStack>
          )}
        </ModalHeader>

        <ModalCloseButton _focus={{ outline: 'none' }} _hover={{ bg: 'blue.50' }} />

        <Divider borderColor="#CBD5E0" />
        <ModalBody>
          <Stack mt="16px">
            <Tabs variant="enclosed" onChange={index => setTabIndex(index)} whiteSpace="nowrap" colorScheme="brand">
              <TabList alignItems={'end'}>
                <Flex>
                  <Tab>{t('workOrderDetails')}</Tab>
                  <Tab>{t('lienWaiver')}</Tab>
                  <Tab>{t('invoice')}</Tab>
                  <Tab>{t('payments')}</Tab>
                  <Tab>{t('notes')}</Tab>
                </Flex>
              </TabList>

              <TabPanels>
                <TabPanel p="0px">
                  <WorkOrderDetailTab workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <LienWaiverTab lienWaiverData={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <InvoiceTabPC workOrder={workOrder} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <PaymentInfoTab projectData={projectData} workOrder={workOrder} onClose={onClose} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WorkOrderDetails
