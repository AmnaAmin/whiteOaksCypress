import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Divider,
  Icon,
  Checkbox,
  Thead,
  TableContainer,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  FormErrorMessage,
  useCheckbox,
  chakra,
} from '@chakra-ui/react'
import React from 'react'
import { BiCalendar, BiDownload, BiUpload, BiXCircle } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'components/form/react-select'
import { documentTypes } from 'utils/vendor-projects'
import { dateFormat } from 'utils/date-time-utils'
import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import { useForm, useFieldArray } from 'react-hook-form'

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
          {props?.date || 'mm/dd/yyyy'}
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
          isTruncated={true}
          maxW="150px"
          title={props.date}
        >
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

export const CustomCheckBox = props => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

  return (
    <chakra.label
      display="flex"
      alignItems="center"
      gridColumnGap={3}
      maxW="125px"
      h="34px"
      rounded="8px"
      bg="green.50"
      cursor="pointer"
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <HStack
        ml="2"
        justifyContent="center"
        border="1px solid #2AB450"
        rounded="full"
        w={4}
        h={4}
        {...getCheckboxProps()}
      >
        {state.isChecked && <Icon as={CheckIcon} boxSize="2" color="#2AB450" />}
      </HStack>
      <Text mr="2" color="#2AB450" {...getLabelProps()}>
        {props.text}
      </Text>
    </chakra.label>
  )
}

const WorkOrderDetailTab = props => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tab',
  })

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

  const onSubmit = values => {
    console.log('Data', values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt="32px" spacing="32px">
        <SimpleGrid columns={5} columnGap="147px">
          <InformationCard title="Vendor Name" date={companyName} />
          <InformationCard title="Vendor Type" date={skillName} />
          <InformationCard title="Email" date={businessEmailAddress} />
          <InformationCard title=" Phone No" date={businessPhoneNumber} />
        </SimpleGrid>
        <Box>
          <Divider borderColor="#CBD5E0" />
        </Box>

        <SimpleGrid columns={5} columnGap="147px">
          <CalenderCard title="WO Issued" date={dateFormat(workOrderIssueDate)} />
          <CalenderCard title="LW Submitted " date={dateFormat(dateLeanWaiverSubmitted)} />
          <CalenderCard title="Permitted Pulled" date={dateFormat(datePermitsPulled)} />
          <CalenderCard title=" Completion Variance" date={durationCategory} />
        </SimpleGrid>
        <Box>
          <Divider borderColor="#CBD5E0" />
        </Box>
      </Stack>
      <Box mt="32px">
        <SimpleGrid columns={4} spacingX={6} spacingY={12}>
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
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Expected Start Date
              </FormLabel>
              <Input type="date" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Expected Completion Date
              </FormLabel>
              <Input type="date" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                Completed By Vendor
              </FormLabel>
              <Input type="date" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
            </FormControl>
          </Box>
        </SimpleGrid>
      </Box>

      <Stack direction="row" mt="32px" justifyContent="space-between">
        <HStack>
          <Text>Assigned Items</Text>
          <Box pl="2" pr="1">
            <Divider orientation="vertical" h="20px" />
          </Box>
          <Button
            type="button"
            variant="ghost"
            colorScheme="brand"
            leftIcon={<Icon as={AddIcon} boxSize={3} />}
            onClick={() =>
              append({
                now: '',
                productName: '',
                details: '',
                quantity: '',
                price: '',
              })
            }
          >
            Add New Item
          </Button>
        </HStack>
        <HStack spacing="16px">
          <Checkbox size="lg">Show Prices to vendor</Checkbox>
          <Checkbox size="lg">Mark all verified</Checkbox>
        </HStack>
        <HStack spacing="16px">
          <Button variant="outline" colorScheme="brand" leftIcon={<Icon as={BiDownload} boxSize={4} />}>
            Download as PDF
          </Button>
          <Button variant="outline" colorScheme="brand">
            Remaining Items
          </Button>
        </HStack>
      </Stack>
      <Box mt="16px" border="1px solid" borderColor="gray.100" borderRadius="md">
        <TableContainer>
          <Box overflow="auto" h="300px">
            <Table>
              <Thead h="72px" zIndex="1" position="sticky" top="0">
                <Tr whiteSpace="nowrap">
                  <Th>SKU</Th>
                  <Th>Product Name</Th>
                  <Th>Details</Th>
                  <Th>Quantity</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Images</Th>
                  <Th>Verification</Th>
                </Tr>
              </Thead>
              <Tbody>
                {fields.map((items, index) => (
                  <Tr key={items.id}>
                    <Td>
                      <HStack>
                        <Icon
                          as={BiXCircle}
                          boxSize={5}
                          color="#4E87F8"
                          onClick={() => remove(index)}
                          cursor="pointer"
                          mt="2"
                        />
                        <FormControl isInvalid={errors.now}>
                          <FormLabel></FormLabel>
                          <Input
                            size="sm"
                            id="now"
                            {...register(`tab.${index}.now`, { required: 'This is required' })}
                          />
                          <FormErrorMessage> {errors.now && errors.now.message} </FormErrorMessage>
                        </FormControl>
                      </HStack>
                    </Td>
                    <Td>
                      <FormControl>
                        <FormLabel></FormLabel>
                        <Input
                          size="sm"
                          id="productName"
                          {...register(`tab.${index}.productName`, { required: 'This is required' })}
                        />
                        <FormErrorMessage>{/* {errors.productName && errors.productName.message} */}</FormErrorMessage>
                      </FormControl>
                    </Td>
                    <Td>
                      <Box>
                        <FormControl>
                          <FormLabel></FormLabel>
                          <Input
                            size="sm"
                            id="details"
                            {...register(`tab.${index}.details`, { required: 'This is required' })}
                          />
                          <FormErrorMessage>{/* {errors.details && errors.details.message} */}</FormErrorMessage>
                        </FormControl>
                      </Box>
                    </Td>
                    <Td>
                      <FormControl>
                        <FormLabel></FormLabel>
                        <Input
                          size="sm"
                          id="quantity"
                          {...register(`tab.${index}.quantity`, { required: 'This is required' })}
                        />
                        <FormErrorMessage>{/* {errors.quantity && errors.quantity.message} */}</FormErrorMessage>
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl>
                        <FormLabel></FormLabel>
                        <Input
                          size="sm"
                          id="price"
                          {...register(`tab.${index}.price`, { required: 'This is required' })}
                        />
                        <FormErrorMessage>{/* {errors.price && errors.price.message} */}</FormErrorMessage>
                      </FormControl>
                    </Td>
                    <Td>
                      <CustomCheckBox text="Completed" />
                    </Td>
                    <Td>
                      <Box>
                        <Button
                          variant="outline"
                          colorScheme="brand"
                          rightIcon={<Icon as={BiUpload} boxSize={3} mb="1" />}
                          size="sm"
                        >
                          Upload
                        </Button>
                      </Box>
                    </Td>
                    <Td>
                      <CustomCheckBox text="Verified" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TableContainer>
      </Box>

      <Box mt="16px">
        <Divider borderColor="#CBD5E0" />
        <HStack alignItems="center" justifyContent="end" spacing="16px" mt="16px" mb="8px">
          <Button onClick={props.onClose} colorScheme="brand" variant="outline">
            {t('cancel')}
          </Button>
          <Button colorScheme="brand" type="submit">
            {t('save')}
          </Button>
        </HStack>
      </Box>
    </form>
  )
}

export default WorkOrderDetailTab
