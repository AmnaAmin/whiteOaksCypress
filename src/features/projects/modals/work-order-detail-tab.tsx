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
  VStack,
} from '@chakra-ui/react'
import React, { useCallback, useState, useRef } from 'react'

import { BiCalendar, BiDownload, BiUpload, BiXCircle } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { convertDateTimeFromServer } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import { useUpdateWorkOrderMutation } from 'utils/work-order'
import { currencyFormatter } from 'utils/stringFormatters'
import { createInvoicePdf } from 'utils/work-order'
import { readFileContent } from 'utils/vendor-details'

const CalenderCard = props => {
  return (
    <Flex justifyContent={'center'}>
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
        w="120px"
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

const UploadImage: React.FC<{ title; item; setImage }> = ({ title, item, setImage }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const onFileChange = useCallback(
    async e => {
      const files = e.target.files
      if (files[0]) {
        const fileCOntent = await readFileContent(files[0])
        const documents = [
          {
            documentType: 58,
            fileObject: fileCOntent,
            fileObjectContentType: files[0].type,
            fileType: files[0].name,
          },
        ]
        setImage(item.id, documents)
      }
    },
    [setImage],
  )

  return (
    <VStack>
      <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={onFileChange}></input>
      <Button
        leftIcon={<BiUpload />}
        variant="outline"
        colorScheme="brand"
        size="sm"
        onClick={e => {
          if (inputRef.current) {
            inputRef.current.click()
          }
        }}
      >
        <Text fontWeight={600} fontSize="14px" color="#4E87F8">
          {title}
        </Text>
      </Button>
    </VStack>
  )
}

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

  const setImage = useCallback(
    (id, image) => {
      const items = assignedItems.map(x => (x.id === id ? { ...x, documents: image } : x))
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
      <ModalBody h="400px">
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
          <Box p={25}>
            <Box>
              <Flex justifyContent="space-between" pb={5} alignItems="center">
                <Text fontSize="16px" fontWeight={500} color="gray.600">
                  {t('assignedLineItems')}
                </Text>

                <HStack>
                  <Button
                    leftIcon={<BiDownload />}
                    variant="outline"
                    colorScheme="brand"
                    size="md"
                    onClick={downloadPdf}
                  >
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
            <Box h={200} overflow="auto" mb={9}>
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
                    <Td textAlign={'center'}>{t('images')}</Td>
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
                        <Td textAlign={'center'}>
                          <CheckboxStructure checked={item.isCompleted} id={item.id} onChange={onStatusChange} />
                        </Td>
                        <Td textAlign={'center'}>
                          <VStack>
                            {item?.documents?.length > 0 && item.documents[0].fileType ? (
                              <Button
                                rightIcon={
                                  <BiXCircle
                                    onClick={e => {
                                      setImage(item.id, null)
                                    }}
                                  />
                                }
                                variant="outline"
                                colorScheme="brand"
                                size="sm"
                              >
                                <Text
                                  fontWeight={600}
                                  fontSize="14px"
                                  color="#4E87F8"
                                  maxW={150}
                                  whiteSpace="nowrap"
                                  overflow={'hidden'}
                                  textOverflow="ellipsis"
                                >
                                  {item.documents[0].fileType}
                                </Text>
                              </Button>
                            ) : (
                              <UploadImage title={'Upload'} item={item} setImage={setImage} />
                            )}
                            {item.s3Url && (
                              <a href={item.s3Url} download>
                                <Flex fontWeight={400} fontSize="12px" color="#4E87F8">
                                  <BiDownload style={{ marginTop: '4px', marginRight: '5px' }} />
                                  <Text maxW="150px" whiteSpace={'nowrap'} overflow="hidden" textOverflow={'ellipsis'}>
                                    {item.fileType}
                                  </Text>
                                </Flex>
                              </a>
                            )}
                          </VStack>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </ModalBody>
      <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
        <Flex w="100%" justifyContent="end">
          <Button variant="outline" colorScheme="brand" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button colorScheme="brand" onClick={saveWorkOrderDetails}>
            {t('save')}
          </Button>
        </Flex>
      </ModalFooter>
    </Box>
  )
}

export default WorkOrderDetailTab
