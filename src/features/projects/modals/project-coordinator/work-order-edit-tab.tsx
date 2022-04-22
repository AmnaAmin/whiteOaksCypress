import { Box, Text, Flex, SimpleGrid, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { BiCalendar } from 'react-icons/bi'
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
        <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
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
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Expected Completion Date
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Completed By Vendor
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
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
