import {
  Box,
  HStack,
  Text,
  Flex,
  SimpleGrid,
  Button,
  Checkbox,
  TableContainer,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
} from '@chakra-ui/react'
import React from 'react'

import { BiCalendar, BiCheck, BiDownload, BiUpload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { convertDateTimeFromServer } from 'utils/date-time-utils'

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

const CheckboxStructure = () => {
  return (
    <Box>
      <Checkbox
        rounded="6px"
        colorScheme="none"
        iconColor="#2AB450"
        h="32px"
        w="145px"
        bg="#F2F3F4"
        color="#A0AEC0"
        _checked={{ bg: '#E7F8EC', color: '#2AB450' }}
        boxShadow="0px 0px 4px -2px "
        justifyContent="center"
        fontSize={14}
        fontWeight={500}
      >
        Completed
      </Checkbox>
    </Box>
  )
}

const UploadImage: React.FC<{ Images }> = ({ Images }) => {
  return (
    <Box overflow="hidden" ml="2">
      <Button _focus={{ outline: 'none' }} variant="unstyled" leftIcon={<BiUpload color="#4E87F8" />} display="flex">
        <Text fontWeight={400} fontSize="14px" color="#4E87F8">
          {Images}
        </Text>
      </Button>
    </Box>
  )
}

const WorkOrderDetailTab = ({ onClose, workOrder }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <SimpleGrid columns={5} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard title="WO Issued" value={convertDateTimeFromServer(workOrder.workOrderIssueDate)} />
        <CalenderCard title="Expected Start " value={convertDateTimeFromServer(workOrder.workOrderStartDate)} />
        <CalenderCard
          title="Expected Completion"
          value={convertDateTimeFromServer(workOrder.workOrderExpectedCompletionDate)}
        />
        <CalenderCard
          title=" Completed by Vendor​"
          value={convertDateTimeFromServer(workOrder.workOrderDateCompleted)}
        />
        <CalenderCard
          title=" Completion Variance"
          value={convertDateTimeFromServer(workOrder.workOrderCompletionDateVariance)}
        />
      </SimpleGrid>
      <Box pt={6}>
        <Flex justifyContent="space-between" pt={2} pb={2} alignItems="center">
          <Text fontSize="16px" fontWeight={500} color="gray.600">
            Assigned Line Items
          </Text>

          <HStack>
            <Button leftIcon={<BiDownload color="#4E87F8" />} mr={5} _focus={{ border: 'none' }} bg="white">
              <Text fontStyle="normal" fontWeight={600} fontSize="14px" color="#4E87F8">
                Download as PDF
              </Text>
            </Button>

            <Button leftIcon={<BiCheck color="#4E87F8" />} _focus={{ border: 'none' }} bg="white">
              <Text fontStyle="normal" fontWeight={600} fontSize="14px" color="#4E87F8">
                Mark All Completed
              </Text>
            </Button>
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
              <Tr>
                <Td>#8383</Td>
                <Td>Debrish Trash </Td>
                <Td>Remove Trash from Outdoor</Td>
                <Td>2</Td>
                <Td>$450</Td>
                <Td>
                  <CheckboxStructure />
                </Td>
                <Td>
                  <UploadImage Images={'Upload'} />
                </Td>
              </Tr>
              <Tr>
                <Td>#33454</Td>
                <Td>Remove Satellite dish </Td>
                <Td>Remove all cables</Td>
                <Td>12</Td>
                <Td>$200</Td>
                <Td>
                  <CheckboxStructure />
                </Td>
                <Td>
                  <UploadImage Images={'First23.img'} />
                </Td>
              </Tr>
              <Tr>
                <Td>#74746</Td>
                <Td>Install Blinders </Td>
                <Td>Replace Curtains</Td>
                <Td>15</Td>
                <Td>$1400</Td>
                <Td>
                  <CheckboxStructure />
                </Td>

                <Td>
                  <UploadImage Images={'First88.img'} />
                </Td>
              </Tr>

              <Tr>
                <Td>#65355</Td>
                <Td>Push Button</Td>
                <Td>Replace Buttons</Td>
                <Td>3</Td>
                <Td>$450</Td>
                <Td>
                  <CheckboxStructure />
                </Td>
                <Td>
                  <UploadImage Images={'Upload'} />
                </Td>
              </Tr>

              <Tr>
                <Td>#65354</Td>
                <Td>Wall Lock Box</Td>
                <Td>Home Depot Lock Box</Td>
                <Td>8</Td>
                <Td>$150</Td>
                <Td>
                  <CheckboxStructure />
                </Td>
                <Td>
                  <UploadImage Images={'Tsk19.img'} />
                </Td>
              </Tr>

              <Tr>
                <Td>#65354</Td>
                <Td>Wall Lock Box</Td>
                <Td>Home Depot Lock Box</Td>
                <Td>8</Td>
                <Td>$150</Td>
                <Td>
                  <CheckboxStructure />
                </Td>
                <Td>
                  <UploadImage Images={'Tsk19.img'} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </TableContainer>

      <Flex h="80px" justifyContent="end" borderTop="1px solid #CBD5E0" pt={5}>
        <Button
          variant="ghost"
          onClick={onClose}
          mr={3}
          color="gray.700"
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          {t('close')}
        </Button>
        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          fontStyle="normal"
          fontSize="14px"
          fontWeight={600}
          h="48px"
          w="130px"
        >
          {t('save')}
        </Button>
      </Flex>
    </Box>
  )
}

export default WorkOrderDetailTab
