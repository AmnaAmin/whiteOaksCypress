import { Box, HStack, Text, Flex, SimpleGrid, Checkbox, Table, Thead, Tr, Tbody, Td, FormLabel } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'

import { BiCalendar, BiDownload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { convertDateTimeFromServer } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { currencyFormatter } from 'utils/stringFormatters'
import { createInvoicePdf } from 'utils/work-order'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <FormLabel variant="strong-label" size="md">
          {props.title}
        </FormLabel>
        <FormLabel variant="light-label" size="md">
          {props.value ? props.value : 'mm/dd/yyy'}
        </FormLabel>
      </Box>
    </Flex>
  )
}

const CheckboxStructure = ({ checked, id, onChange }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Checkbox
        id={id}
        isChecked={checked}
        rounded="6px"
        colorScheme="none"
        iconColor="#2AB450"
        h="32px"
        w="140px"
        bg="#F2F3F4"
        color="#A0AEC0"
        _checked={{ bg: '#E7F8EC', color: '#2AB450' }}
        boxShadow="0px 0px 4px -2px "
        justifyContent="center"
        fontSize={14}
        onChange={e => {
          onChange(e, id)
        }}
      >
        {t('completed')}
      </Checkbox>
    </Box>
  )
}

/* commenting till functionality is complete
  const UploadImage: React.FC<{ Images }> = ({ Images }) => {
  return (
    <Box>
      <Button
        minW={'auto'}
        _focus={{ outline: 'none' }}
        variant="unstyled"
        leftIcon={<BiUpload color="#4E87F8" />}
        display="flex"
      >
        <Text fontWeight={400} fontSize="14px" color="#4E87F8">
          {Images}
        </Text>
      </Button>
    </Box>
  )
} */

const WorkOrderDetailTab = ({ onClose, workOrder, projectData }) => {
  const { t } = useTranslation()
  const [assignedItems, setAssignedItems] = useState(workOrder.assignedItems ?? [])
  const { mutate: updateWorkOrderDetails } = useUpdateWorkOrderMutation()

  const onMarkCompleted = useCallback(
    value => {
      setAssignedItems(assignedItems => assignedItems.map(item => ({ ...item, isCompleted: value })))
    },
    [assignedItems, setAssignedItems],
  )

  const onStatusChange = useCallback(
    (e, id) => {
      const items = assignedItems.map(x => (x.id === id ? { ...x, isCompleted: !x.isCompleted } : x))
      setAssignedItems([...items])
    },
    [assignedItems, setAssignedItems],
  )

  const saveWorkOrderDetails = useCallback(() => {
    updateWorkOrderDetails({ ...workOrder, assignedItems })
  }, [assignedItems])

  const downloadPdf = () => {
    let doc = new jsPDF()
    doc = createInvoicePdf(doc, workOrder, projectData, assignedItems)
    doc.save('assigned-items.pdf')
  }
  return (
    <Box>
      <SimpleGrid columns={4} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard title={t('WOIssued')} value={convertDateTimeFromServer(workOrder.workOrderIssueDate)} />
        <CalenderCard title={t('expectedStart')} value={convertDateTimeFromServer(workOrder.workOrderStartDate)} />
        <CalenderCard
          title={t('expectedCompletion')}
          value={convertDateTimeFromServer(workOrder.workOrderExpectedCompletionDate)}
        />
        <CalenderCard
          title={t('completedByVendor')}
          value={convertDateTimeFromServer(workOrder.workOrderDateCompleted)}
        />
      </SimpleGrid>
      {assignedItems && assignedItems.length > 0 && (
        <>
          <Box pt={6}>
            <Flex justifyContent="space-between" pt={2} pb={2} alignItems="center">
              <Text fontSize="16px" fontWeight={500} color="gray.600">
                {t('assignedLineItems')}
              </Text>

              <HStack>
                <Button leftIcon={<BiDownload />} variant="outline" colorScheme="brand" size="md" onClick={downloadPdf}>
                  {t('downloadPDF')}
                </Button>
                <Checkbox
                  size="md"
                  colorScheme="brand"
                  onChange={e => {
                    onMarkCompleted(e.target.checked)
                  }}
                  isChecked={assignedItems.every(e => {
                    return e.isCompleted
                  })}
                >
                  <FormLabel variant="strong-label" size="md" mt="7px">
                    {t('markCompleted')}
                  </FormLabel>
                </Checkbox>
              </HStack>
            </Flex>
          </Box>
          <Box h={340} overflow="auto" mb={9}>
            <Table border="1px solid #E2E8F0" variant="simple" size="md">
              <Thead>
                <Tr>
                  <Td>SKU</Td>
                  <Td>{t('productName')}</Td>
                  <Td>{t('details')}</Td>
                  <Td>{t('quantity')}</Td>
                  <Td>{t('price')}</Td>
                  <Td>{t('status')}</Td>
                  {/*<Td>Images</Td>*/}
                </Tr>
              </Thead>
              <Tbody>
                {assignedItems &&
                  assignedItems.map((item, i) => (
                    <Tr>
                      <Td>{item.id}</Td>
                      <Td>{item.productName} </Td>
                      <Td>{item.description}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{currencyFormatter(item.price)}</Td>
                      <Td>
                        <CheckboxStructure checked={item.isCompleted} id={item.id} onChange={onStatusChange} />
                      </Td>
                      {/*<Td>
                    <UploadImage Images={'Upload'} />
                  </Td>*/}
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
      <Flex h="80px" justifyContent="end" borderTop="1px solid #CBD5E0" pt={5}>
        <Button variant="outline" colorScheme="brand" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button colorScheme="brand" onClick={saveWorkOrderDetails}>
          {t('save')}
        </Button>
      </Flex>
    </Box>
  )
}

export default WorkOrderDetailTab
