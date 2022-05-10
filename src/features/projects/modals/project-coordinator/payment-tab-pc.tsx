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
import React, { useState } from 'react'
import { BiCalendar } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { paymentsTerms } from 'utils/vendor-projects'
import { dateFormat } from 'utils/date-time-utils'
import { currencyFormatter } from 'utils/stringFormatters'
import { useCall } from 'utils/pc-projects'
import { convertDateTimeToServerISO } from 'components/table/util'
import Select from 'components/form/react-select'

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
  const { workOrder } = props

  interface Date {
    date: string
    prevState: null
  }
  const [paymentProcessed, setPaymentProcessed] = useState<Date | null>(null)
  const [paidDate, setPaidDate] = useState<Date | null>(null)
  const [paidTerm, setPaidTerm] = useState<Date | null>(null)

  const handlePPChange = e => {
    setPaymentProcessed(e.target.value)
  }
  const handlePDChange = e => {
    setPaidDate(e.target.value)
  }
  const handlePTChange = e => {
    setPaidTerm(e.label)
  }

  const { t } = useTranslation()
  const {
    leanWaiverSubmitted,
    paymentTermDate,
    durationCategory,
    dateInvoiceSubmitted,
    clientApprovedAmount,
    clientOriginalApprovedAmount,
    expectedPaymentDate,
    paid,
  } = props.workOrder

  const entity = {
    ...workOrder,
    ...{ datePaymentProcessed: convertDateTimeToServerISO(paymentProcessed) },
    ...{ datePaid: convertDateTimeToServerISO(paidDate) },
    ...{ paymentTerm: paidTerm },
  }

  const { mutate: saveChanges } = useCall()

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
                <Input readOnly value={dateInvoiceSubmitted ? dateFormat(dateInvoiceSubmitted) : 'mm/dd/yyyy'} />
              </InputGroup>
            </FormControl>
          </Box>
          <Box>
            <FormControl height="40px">
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Payemt Terms
              </FormLabel>
              <Select options={paymentsTerms} selectProps={{ isBorderLeft: true }} onChange={e => handlePTChange(e)} />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Payment Term Date
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<BiCalendar color="gray.300" />} />
                <Input readOnly value={paymentTermDate ? dateFormat(paymentTermDate) : 'mm/dd/yyyy'} />
              </InputGroup>
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
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<BiCalendar color="gray.300" />} />
                <Input readOnly value={expectedPaymentDate ? dateFormat(expectedPaymentDate) : 'mm/dd/yyyy'} />
              </InputGroup>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Payment Processed
              </FormLabel>
              <Input onChange={date => handlePPChange(date)} type="date" />
            </FormControl>
          </Box>

          <Box>
            <FormControl>
              <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                Paid
              </FormLabel>
              <Input onChange={date => handlePDChange(date)} type="date" readOnly={!paid ? true : false} />
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

      <Flex mt="40px" borderTop="1px solid #CBD5E0" h="100px" alignItems="center" justifyContent="end">
        <Button variant="ghost" onClick={props.onClose} colorScheme="brand">
          {t('close')}
        </Button>
        <Button onClick={() => saveChanges(entity)} colorScheme="brand">
          {t('save')}
        </Button>
      </Flex>
    </Box>
  )
}

export default PaymentInfoTab
