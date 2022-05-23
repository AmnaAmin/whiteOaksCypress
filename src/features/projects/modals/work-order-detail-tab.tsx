import {
  Box,
  HStack,
  Text,
  Flex,
  SimpleGrid,
  Checkbox,
  TableContainer,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'

import { BiCalendar, BiCheck, BiDownload, BiUpload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { convertDateTimeFromServer } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useUpdateWorkOrderMutation } from 'utils/work-order'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.value ? props.value : 'mm/dd/yyy'}
        </Text>
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
        {checked ? 'Completed' : 'Not Completed'}
      </Checkbox>
    </Box>
  )
}

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
}

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
  const { mutate: updateWorkOrderDetails, isSuccess } = useUpdateWorkOrderMutation()

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
            <Button leftIcon={<BiDownload color="#4E87F8" />} variant="ghost" colorScheme="brand" onClick={downloadPdf}>
              Download as PDF
            </Button>
            {assignedItems.every(e => {
              return e.isCompleted
            }) ? (
              <Button
                onClick={() => {
                  onMarkCompleted(false)
                }}
                variant="ghost"
                colorScheme="brand"
              >
                <Text fontStyle="normal" fontWeight={600} fontSize="14px" color="#4E87F8">
                  Mark All as Incomplete
                </Text>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onMarkCompleted(true)
                }}
                leftIcon={<BiCheck color="#4E87F8" />}
                variant="ghost"
                colorScheme="brand"
              >
                <Text fontStyle="normal" fontWeight={600} fontSize="14px" color="#4E87F8">
                  Mark All Completed
                </Text>
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      <TableContainer border="1px solid #E2E8F0" mb={9}>
        <Box h={340} overflow="auto">
          <Table variant="simple" size="md" fontSize={14} color="gray.600" whiteSpace="initial">
            <Thead bg=" #F7FAFC" position="sticky" top={0} zIndex={2} fontWeight={600}>
              <Tr>
                <Td>SKU</Td>
                <Td>Product Name</Td>
                <Td>Details</Td>
                <Td>Quantity</Td>
                <Td>Price</Td>
                <Td>Status</Td>
                <Td>Images</Td>
              </Tr>
            </Thead>
            <Tbody zIndex={1} fontWeight={400}>
              {assignedItems &&
                assignedItems.map((item, i) => (
                  <Tr>
                    <Td>{item.id}</Td>
                    <Td>{item.productName} </Td>
                    <Td>{item.details}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{item.price}</Td>
                    <Td>
                      <CheckboxStructure checked={item.isCompleted} id={item.id} onChange={onStatusChange} />
                    </Td>
                    <Td>
                      <UploadImage Images={'Upload'} />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>

      <Flex h="80px" justifyContent="end" borderTop="1px solid #CBD5E0" pt={5}>
        <Button variant="ghost" colorScheme="brand" onClick={onClose} mr={3} border="1px solid">
          {t('close')}
        </Button>
        <Button colorScheme="brand" onClick={saveWorkOrderDetails}>
          {t('save')}
        </Button>
      </Flex>
    </Box>
  )
}

export default WorkOrderDetailTab
