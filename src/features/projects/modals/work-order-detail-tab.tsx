import { Box, HStack, Text, Flex, SimpleGrid, Checkbox, Table, Thead, Tr, Tbody, Td, FormLabel } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'

import { BiCalendar, BiDownload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { convertDateTimeFromServer } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { currencyFormatter } from 'utils/stringFormatters'

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
        {'Completed'}
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

const WorkOrderDetailTab = ({ onClose, workOrder }) => {
  const { t } = useTranslation()
  const [assignedItems, setAssignedItems] = useState(
    workOrder.assignedItems ?? [
      {
        id: '8383',
        productName: 'Debrish Trash',
        description: 'Replace Buttons',
        quantity: '4',
        price: '350',
        workOrderId: '77',
        isCompleted: true,
        isVerified: true,
      },
      {
        id: '33454',
        productName: 'Remove Satellite dish',
        description: 'Remove all cables',
        quantity: '12',
        price: '200',
        workOrderId: '77',
        isCompleted: true,
        isVerified: false,
      },
      {
        id: '74746',
        productName: 'Install Blinders',
        description: 'Replace Curtains',
        quantity: '15',
        price: '400',
        workOrderId: '77',
        isCompleted: false,
        isVerified: false,
      },
    ],
  )
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
    const doc = new jsPDF()
    const basicFont = undefined
    const heading = 'Assigned Line Items'
    doc.setFontSize(12)
    doc.setFont(basicFont as any, 'bold')
    const xHeading = (doc.internal.pageSize.getWidth() - doc.getTextWidth(heading)) / 2
    doc.text(heading, xHeading, 20)
    doc.setFont(basicFont as any, 'normal')
    autoTable(doc, {
      startY: 30,
      alternateRowStyles: { fillColor: '#FFFFFF' },
      headStyles: { fillColor: '#F7FAFC', textColor: '#4A5568', lineColor: [0, 0, 0] },
      theme: 'grid',
      bodyStyles: { lineColor: '#B2F5EA', minCellHeight: 15 },
      body: [
        ...assignedItems.map(ai => {
          return {
            id: ai.id,
            productName: ai.productName,
            details: ai.details,
            quantity: ai.quantity,
            price: ai.price,
            isCompleted: ai.isCompleted,
            isVerified: ai.isVerified,
          }
        }),
      ],
      columns: [
        { header: 'SKU', dataKey: 'id' },
        { header: 'Product Name', dataKey: 'productName' },
        { header: 'Details', dataKey: 'details' },
        { header: 'Quantity', dataKey: 'quantity' },
        { header: 'Price', dataKey: 'price' },
        { header: 'Status', dataKey: 'isCompleted' },
        { header: 'Verified', dataKey: 'isVerified' },
      ],
    })
    doc.save('assigned-items.pdf')
  }
  return (
    <Box>
      <SimpleGrid columns={4} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard title="WO Issued" value={convertDateTimeFromServer(workOrder.workOrderIssueDate)} />
        <CalenderCard title="Expected Start " value={convertDateTimeFromServer(workOrder.workOrderStartDate)} />
        <CalenderCard
          title="Expected Completion"
          value={convertDateTimeFromServer(workOrder.workOrderExpectedCompletionDate)}
        />
        <CalenderCard title="Completed by Vendor" value={convertDateTimeFromServer(workOrder.workOrderDateCompleted)} />
      </SimpleGrid>
      <Box pt={6}>
        <Flex justifyContent="space-between" pt={2} pb={2} alignItems="center">
          <Text fontSize="16px" fontWeight={500} color="gray.600">
            Assigned Line Items
          </Text>

          <HStack>
            <Button leftIcon={<BiDownload />} variant="outline" colorScheme="brand" size="lg" onClick={downloadPdf}>
              Download as PDF
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
                Mark all Completed
              </FormLabel>
            </Checkbox>
          </HStack>
        </Flex>
      </Box>
      <Box h={340} overflow="auto" mb={9}>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Td>SKU</Td>
              <Td>Product Name</Td>
              <Td>Details</Td>
              <Td>Quantity</Td>
              <Td>Price</Td>
              <Td>Status</Td>
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

      <Flex h="80px" justifyContent="end" borderTop="1px solid #CBD5E0" pt={5}>
        <Button variant="ghost" colorScheme="brand" onClick={onClose} mr={3} border="1px solid">
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
