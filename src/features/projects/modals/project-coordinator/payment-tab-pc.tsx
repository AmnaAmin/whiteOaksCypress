import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react'
import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import { documentTypes } from 'utils/vendor-projects'
import { dateFormat } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/stringFormatters'

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
          {props?.date}
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

const PaymentInfoTab = props => {
  const { t } = useTranslation()
  const {
    leanWaiverSubmitted,
    paymentTermDate,
    durationCategory,
    dateInvoiceSubmitted,
    paymentTerm,
    clientApprovedAmount,
    clientOriginalApprovedAmount,
  } = props.workOrder

  const { sowOriginalContractAmount } = props?.projectData

  return (
    <Box>
      <SimpleGrid columns={5} spacing={8} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
        <CalenderCard title="LW Date" date={leanWaiverSubmitted ? dateFormat(leanWaiverSubmitted) : 'mm/dd/yyyy'} />
        <CalenderCard title="Permit Date " date={paymentTermDate ? dateFormat(paymentTermDate) : 'mm/dd/yyyy'} />
        <InformationCard title="Pay date variance" date={durationCategory} />
      </SimpleGrid>

      <Box mt={10}>
        <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Invoiced Submitted
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<BiCalendar color="gray.300" />} />
                <Input value={dateFormat(props.projectData.clientDueDate)} type="tel" />
              </InputGroup>
              <Input
                value={dateFormat(dateInvoiceSubmitted)}
                type="date"
                height="40px"
                borderLeft="2px solid #4E87F8"
                focusBorderColor="none"
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl height="40px">
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Payemt Terms
              </FormLabel>
              <ReactSelect selectProps={{ isLeftBorder: true }} options={documentTypes || paymentTerm} />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Payment Term Date
              </FormLabel>
              <Input
                value={paymentTermDate}
                type="date"
                height="40px"
                borderLeft="2px solid #4E87F8"
                focusBorderColor="none"
              />
            </FormControl>
          </Box>
        </SimpleGrid>
      </Box>

      <Box mt={10}>
        <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Expected Pay
              </FormLabel>
              <Input
                value={paymentTermDate}
                type="date"
                height="40px"
                borderLeft="2px solid #4E87F8"
                focusBorderColor="none"
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Payment Processed
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Paid
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
        </SimpleGrid>
        <Box mt={10}>
          <SimpleGrid w="80%" columns={4} spacingX={6} spacingY={12}>
            <Box>
              <FormControl>
                <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                  WO Original amount
                </FormLabel>
                <Input readOnly={true} value={currencyFormatter(sowOriginalContractAmount)} />
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                  Client original amount
                </FormLabel>
                <Input readOnly={true} value={currencyFormatter(clientApprovedAmount)} />
              </FormControl>
            </Box>

            <Box height="80px">
              <FormControl>
                <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                  Client final approved amount
                </FormLabel>
                <Input value={currencyFormatter(clientOriginalApprovedAmount)} readOnly={true} />
              </FormControl>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      <Flex mt="50px" borderTop="1px solid #CBD5E0" h="100px" alignItems="center" justifyContent="end">
        <Button variant="ghost" onClick={props.onClose} colorScheme="brand">
          {t('close')}
        </Button>
        <Button colorScheme="brand">{t('save')}</Button>
      </Flex>
    </Box>
  )
}

export default PaymentInfoTab
