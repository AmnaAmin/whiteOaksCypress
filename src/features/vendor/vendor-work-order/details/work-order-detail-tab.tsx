import {
  Box,
  HStack,
  Text,
  Flex,
  SimpleGrid,
  Checkbox,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  FormLabel,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'

import { BiCalendar, BiDownload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { convertDateTimeFromServer } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import { currencyFormatter } from 'utils/string-formatters'
import { createInvoicePdf } from 'api/work-order'
import { CustomCheckBox } from 'features/work-order/details/assigned-items'

const CalenderCard = props => {
  return (
    <Flex justifyContent={'left'}>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <FormLabel variant="strong-label" size="md">
          {props.title}
        </FormLabel>
        <FormLabel data-testid={props.title} variant="light-label" size="md">
          {props.value ? props.value : 'mm/dd/yy'}
        </FormLabel>
      </Box>
    </Flex>
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
  const { mutate: updateWorkOrderDetails } = useUpdateWorkOrderMutation({})

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
    createInvoicePdf(doc, workOrder, projectData, assignedItems)
  }
  return (
    <Box>
      <ModalBody h="400px">
        <SimpleGrid columns={4} spacing={8} borderBottom="1px solid  #E2E8F0" minH="80px" m="30px" alignItems={'left'}>
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
          <Box pl={25} pr={25}>
            <Box>
              <Flex justifyContent="space-between" pb={5} alignItems="center">
                <Text fontSize="16px" fontWeight={500} color="gray.600">
                  {t('assignedLineItems')}
                </Text>

                <HStack>
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
                  <Button
                    leftIcon={<BiDownload />}
                    variant="outline"
                    colorScheme="brand"
                    size="md"
                    onClick={downloadPdf}
                  >
                    {t('downloadPDF')}
                  </Button>
                </HStack>
              </Flex>
            </Box>
            <Box h={200} overflow="auto">
              <Table border="1px solid #E2E8F0" variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Td>{t('sku')}</Td>
                    <Td>{t('productName')}</Td>
                    <Td>{t('location')}</Td>
                    <Td>{t('details')}</Td>
                    <Td textAlign={'center'} w="100px">
                      {t('quantity')}
                    </Td>
                    {workOrder.showPricing && <Td>{t('price')}</Td>}
                    <Td textAlign={'center'}>{t('status')}</Td>
                    {/*<Td>Images</Td>*/}
                  </Tr>
                </Thead>
                <Tbody>
                  {assignedItems &&
                    assignedItems.map((item, i) => (
                      <Tr>
                        <Td>{item.id}</Td>
                        <Td>{item.productName} </Td>
                        <Td>{item.location} </Td>
                        <Td>{item.description}</Td>
                        <Td textAlign={'center'} w="100px">
                          {item.quantity}
                        </Td>
                        {workOrder.showPricing && <Td>{currencyFormatter(item.price)}</Td>}
                        <Td alignItems={'center'}>
                          <CustomCheckBox
                            text="Completed"
                            isChecked={item.isCompleted}
                            id={item.id}
                            onChange={e => {
                              onStatusChange(e, item.id)
                            }}
                          ></CustomCheckBox>
                        </Td>
                        {/*<Td>
                    <UploadImage Images={'Upload'} />
                  </Td>*/}
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </ModalBody>
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <HStack spacing="16px" w="100%" justifyContent="end">
          <Button variant="outline" colorScheme="brand" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button colorScheme="brand" onClick={saveWorkOrderDetails}>
            {t('save')}
          </Button>
        </HStack>
      </ModalFooter>
    </Box>
  )
}

export default WorkOrderDetailTab
