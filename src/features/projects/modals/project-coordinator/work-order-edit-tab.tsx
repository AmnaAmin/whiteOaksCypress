import { Box, Text, Flex, Button, FormControl, FormLabel, Input, Grid, Divider, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import { documentTypes } from 'utils/vendor-projects'
import { dateFormat } from 'utils/date-time-utils'

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
          {props?.date || 'dd/mm/yy'}
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
        <Text
          color="gray.500"
          fontSize="14px"
          fontStyle="normal"
          fontWeight={400}
          w="150px"
          isTruncated
          title={props.date}
        >
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const WorkOrderDetailTab = props => {
  const { t } = useTranslation()
  const {
    skillName,
    companyName,
    businessEmailAddress,
    businessPhoneNumber,
    workOrderIssueDate,
    dateLeanWaiverSubmitted,
    datePermitsPulled,
    durationCategory,
  } = props.workOrder

  return (
    <Box>
      <Grid
        gridTemplateColumns="repeat(auto-fill,minmax(205px,1fr))"
        gap="16px"
        minH="110px"
        alignItems={'center'}
        py="15px"
      >
        <InformationCard title="Vendor Name" date={companyName} />
        <InformationCard title="Vendor Type" date={skillName} />
        <InformationCard title="Email" date={businessEmailAddress} />
        <InformationCard title=" Phone No" date={businessPhoneNumber} />
      </Grid>
      <Divider border="1px solid  #E2E8F0" />

      <Grid
        gridTemplateColumns="repeat(auto-fill,minmax(200px,1fr))"
        gap="16px"
        minH="110px"
        alignItems={'center'}
        py="15px"
      >
        <CalenderCard title="WO Issued" date={dateFormat(workOrderIssueDate)} />
        <CalenderCard title="LW Submitted " date={dateFormat(dateLeanWaiverSubmitted)} />
        <CalenderCard title="Permitted Pulled" date={dateFormat(datePermitsPulled)} />
        <CalenderCard title=" Completion Variance" date={durationCategory} />
      </Grid>
      <Divider border="1px solid  #E2E8F0" />
      <Box mt={10}>
        <SimpleGrid gridTemplateColumns="repeat(auto-fill,minmax(200px,1fr))" gap="16px">
          <Box w="215px">
            <FormControl>
              <FormLabel variant={'strong-label'} size={'md'}>
                Expected Start Date
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant={'strong-label'} size={'md'}>
                Expected Completion Date
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel variant={'strong-label'} size={'md'}>
                Completed By Vendor
              </FormLabel>
              <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl height="40px">
              <FormLabel variant={'strong-label'} size={'md'}>
                Cancel Work Order
              </FormLabel>
              <ReactSelect selectProps={{ isBorderLeft: true }} options={documentTypes} />
            </FormControl>
          </Box>
        </SimpleGrid>
      </Box>
      <Flex mt="75px" borderTop="1px solid #CBD5E0" h="100px" alignItems="center" justifyContent="end">
        <Button onClick={props.onClose} colorScheme="brand" variant="outline" mr={3}>
          {t('cancel')}
        </Button>
        <Button colorScheme="brand">{t('save')}</Button>
      </Flex>
    </Box>
  )
}

export default WorkOrderDetailTab
