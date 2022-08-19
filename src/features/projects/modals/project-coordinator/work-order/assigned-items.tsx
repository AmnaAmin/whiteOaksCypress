import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useCheckbox,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { BiDownload, BiUpload, BiXCircle } from 'react-icons/bi'
import { useAssignLineItems } from 'utils/work-order'
import RemainingItemsModal from './remaining-items-modal'

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
      bg={state.isChecked ? 'green.50' : '#F2F3F4'}
      cursor="pointer"
      {...htmlProps}
    >
      <input {...getInputProps()} hidden id={props.id} />
      <HStack
        ml="2"
        justifyContent="center"
        border={state.isChecked ? '1px solid #2AB450' : '1px solid #A0AEC0'}
        rounded="full"
        w={4}
        id={props.id}
        h={4}
        {...getCheckboxProps()}
        onChange={() => {}}
      >
        {state.isChecked && <Icon as={CheckIcon} boxSize="2" color={state.isChecked ? '#2AB450' : '#A0AEC0'} />}
      </HStack>
      <Text mr="2" color={state.isChecked ? '#2AB450' : '#A0AEC0'} {...getLabelProps()}>
        {props.text}
      </Text>
    </chakra.label>
  )
}

const AssignedItems = props => {
  const { workOrder } = props
  const [showLineItems] = useState(true)

  const { mutate: unAssignLineItem } = useAssignLineItems(props?.workOrder?.projectId)

  const { control, register, getValues } = useFormContext<any>()

  const {
    fields: manualItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'manualItems',
  })

  const { fields: assignedItems } = useFieldArray({
    control,
    name: 'assignedItems',
  })

  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  return (
    <Box>
      {showLineItems && (
        <>
          <Stack direction="row" mt="32px" justifyContent="space-between" mx="32px">
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
                    sku: '',
                    productName: '',
                    details: '',
                    quantity: '',
                    price: '',
                    checked: false,
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
              <Button variant="outline" colorScheme="brand" onClick={onOpenRemainingItemsModal}>
                Remaining Items
              </Button>
            </HStack>
          </Stack>

          <Box mt="16px" border="1px solid" borderColor="gray.100" borderRadius="md" mx="32px">
            <TableContainer>
              <Box>
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
                    {assignedItems.map((items, index) => {
                      return (
                        <Tr>
                          <Td>
                            <HStack position="relative" right="16px">
                              <Icon
                                as={BiXCircle}
                                boxSize={5}
                                color="#4E87F8"
                                onClick={() => unAssignLineItem(getValues(`assignedItems.${index}.sku`))}
                                cursor="pointer"
                              ></Icon>
                              <span>{getValues(`assignedItems.${index}.sku`)}</span>
                            </HStack>
                          </Td>
                          <Td>{getValues(`assignedItems.${index}.productName`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.details`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.quantity`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.price`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.status`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.image`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.verification`)}</Td>
                        </Tr>
                      )
                    })}
                    {manualItems.map((items, index) => {
                      return (
                        <Tr>
                          <Td>
                            <HStack position="relative" right="16px">
                              <Icon
                                as={BiXCircle}
                                boxSize={5}
                                color="#4E87F8"
                                onClick={() => remove(index)}
                                cursor="pointer"
                                mt="2"
                              />
                              <FormControl>
                                <FormLabel></FormLabel>
                                <Input
                                  size="sm"
                                  id="now"
                                  {...register(`manualItems.${index}.sku`, { required: 'This is required' })}
                                />
                              </FormControl>
                            </HStack>
                          </Td>
                          <Td>
                            <FormControl>
                              <FormLabel></FormLabel>
                              <Input
                                size="sm"
                                id="productName"
                                {...register(`manualItems.${index}.productName`, {
                                  required: 'This is required',
                                })}
                              />
                            </FormControl>
                          </Td>
                          <Td>
                            <Box>
                              <FormControl>
                                <FormLabel></FormLabel>
                                <Input
                                  size="sm"
                                  id="details"
                                  {...register(`manualItems.${index}.details`, { required: 'This is required' })}
                                />
                              </FormControl>
                            </Box>
                          </Td>
                          <Td>
                            <FormControl>
                              <FormLabel></FormLabel>
                              <Input
                                size="sm"
                                id="quantity"
                                {...register(`manualItems.${index}.quantity`, { required: 'This is required' })}
                              />
                            </FormControl>
                          </Td>
                          <Td>
                            <FormControl>
                              <FormLabel></FormLabel>
                              <Input
                                size="sm"
                                id="price"
                                {...register(`manualItems.${index}.price`, { required: 'This is required' })}
                              />
                            </FormControl>
                          </Td>
                          <Td>
                            <CustomCheckBox text="Completed" />
                          </Td>
                          <Td>
                            <Box>
                              <Button
                                pt="1"
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
                      )
                    })}
                  </Tbody>
                </Table>
              </Box>
            </TableContainer>
          </Box>
        </>
      )}
      <RemainingItemsModal
        workOrder={workOrder}
        isOpen={isOpenRemainingItemsModal}
        onClose={onCloseRemainingItemsModal}
      />
    </Box>
  )
}

export default AssignedItems
