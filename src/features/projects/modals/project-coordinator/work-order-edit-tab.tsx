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
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from '@chakra-ui/react'
import React from 'react'

import { BiCalendar, BiCheck, BiDownload, BiUpload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import { documentTypes } from 'utils/vendor-projects'

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
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      <Box lineHeight="20px">
        <Text fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.date}
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

const WorkOrderDetailTab = ({ onClose }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <SimpleGrid columns={5} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <InformationCard title="Vendor Name" date="ADT Renovations" />
        <InformationCard title="Vendor Type" date="General Labor" />
        <InformationCard title="Email" date="vendor@gmail.com" />
        <InformationCard title=" Phone No" date="+12345678" />
      </SimpleGrid>

      <SimpleGrid columns={5} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard title="WO Issued" date="11/14/2021" />
        <CalenderCard title="LW Submitted " date="dd/mm/yy" />
        <CalenderCard title="Permitted Pulled" date="dd/mm/yy" />
        <CalenderCard title=" Completion Variance" date="6 Days" />
      </SimpleGrid>

      <Box mt={10}>
        <SimpleGrid w="85%" columns={4} spacingX={6} spacingY={12}>
          <Box>
            <FormControl height="40px">
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Cancel Work Order
              </FormLabel>
              <ReactSelect selectProps={{ isLeftBorder: true }} options={documentTypes} />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Expected Start Date
              </FormLabel>
              <Input placeholder="dd/mm/yy" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Expected Completion Date
              </FormLabel>
              <Input placeholder="dd/mm/yy" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Completed By Vendor
              </FormLabel>
              <Input placeholder="dd/mm/yy" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
        </SimpleGrid>
      </Box>
      <Flex mt="70px" borderTop="1px solid #CBD5E0" h="100px" alignItems="center" justifyContent="end">
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
