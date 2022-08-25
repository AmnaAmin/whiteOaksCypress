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
  Spinner,
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
import { WORK_ORDER } from 'features/project-coordinator/work-order/workOrder.i18n'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiXCircle } from 'react-icons/bi'
import { LineItems, useRemainingLineItems } from 'utils/work-order'
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
        onChange={e => {
          props.onChange(e)
        }}
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
  const { swoProject, isLoadingLineItems } = props
  const [showLineItems] = useState(true)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>([])
  const { t } = useTranslation()

  const { remainingItems, isLoading } = useRemainingLineItems(swoProject?.id)
  const { control, register, getValues, setValue } = useFormContext<any>()
  const values = getValues()

  const {
    fields: manualItems,
    remove,
    append: appendManual,
  } = useFieldArray({
    control,
    name: 'manualItems',
  })

  const {
    fields: assignedItems,
    append,
    remove: removeAssigned,
  } = useFieldArray({
    control,
    name: 'assignedItems',
  })
  const lineItems = useWatch({ name: 'assignedItems', control })
  console.log('Line Items', lineItems)
  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  useEffect(() => {
    setUnAssignedItems(remainingItems ?? [])
  }, [remainingItems])

  const setAssignedItems = useCallback(
    items => {
      const selectedIds = items.map(i => i.id)
      const assigned = [
        ...items.map(s => {
          return { ...s, isVerified: false, isCompleted: false }
        }),
      ]
      append(assigned)
      setUnAssignedItems([...unassignedItems.filter(i => !selectedIds.includes(i.id))])
    },
    [unassignedItems, setUnAssignedItems],
  )
  return (
    <Box>
      {showLineItems && (
        <>
          <Stack direction="row" mt="32px" justifyContent="space-between">
            <HStack>
              <Text>{t(`${WORK_ORDER}.assignedLineItems`)}</Text>
              <Box pl="2" pr="1">
                <Divider orientation="vertical" h="20px" />
              </Box>
              <Button
                type="button"
                variant="ghost"
                colorScheme="brand"
                leftIcon={<Icon as={AddIcon} boxSize={3} />}
                onClick={() =>
                  appendManual({
                    sku: '',
                    productName: '',
                    details: '',
                    quantity: '',
                    price: '',
                    isVerified: false,
                    isCompleted: false,
                  })
                }
              >
                {t(`${WORK_ORDER}.addNewItem`)}
              </Button>
            </HStack>
            <HStack spacing="16px">
              <Checkbox size="lg" {...register('showPrice')}>
                {t(`${WORK_ORDER}.showPrice`)}
              </Checkbox>
              <Checkbox
                size="lg"
                isChecked={lineItems?.length > 0 && lineItems.every(l => l.isVerified)}
                onChange={e => {
                  assignedItems.forEach((item, index) => {
                    setValue(`assignedItems.${index}.isVerified`, e.currentTarget.checked)
                  })
                }}
              >
                {t(`${WORK_ORDER}.markAllVerified`)}
              </Checkbox>
              {/*<Button variant="outline" colorScheme="brand" leftIcon={<Icon as={BiDownload} boxSize={4} />}>
                {t(`${WORK_ORDER}.downloadPDF`)}
            </Button> */}
              <Button variant="outline" colorScheme="brand" onClick={onOpenRemainingItemsModal}>
                {t(`${WORK_ORDER}.remainingItems`)}
              </Button>
            </HStack>
          </Stack>

          <Box mt="16px" border="1px solid" borderColor="gray.100" borderRadius="md">
            <TableContainer>
              <Box>
                <Table>
                  <Thead h="72px" position="sticky" top="0">
                    <Tr whiteSpace="nowrap">
                      <Th>{t(`${WORK_ORDER}.sku`)}</Th>
                      <Th>{t(`${WORK_ORDER}.productName`)}</Th>
                      <Th>{t(`${WORK_ORDER}.details`)}</Th>
                      <Th>{t(`${WORK_ORDER}.quantity`)}</Th>
                      <Th>{t(`${WORK_ORDER}.price`)}</Th>
                      <Th textAlign={'center'}>{t(`${WORK_ORDER}.status`)}</Th>
                      {/*<Th>{ t(`${WORK_ORDER}.images`)}</Th> */}
                      <Th textAlign={'center'}>{t(`${WORK_ORDER}.verification`)}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoadingLineItems ? (
                      <Tr>
                        <Td colSpan={7} textAlign="center">
                          <Spinner size="md" />
                        </Td>
                      </Tr>
                    ) : (
                      <>
                        {assignedItems?.length < 1 && manualItems?.length < 1 && (
                          <Tr>
                            <Td colSpan={7} textAlign="center">
                              No data returned for this view
                            </Td>
                          </Tr>
                        )}
                        {assignedItems.map((items, index) => {
                          return (
                            <Tr>
                              <Td>
                                <HStack position="relative" right="16px">
                                  <Icon
                                    as={BiXCircle}
                                    boxSize={5}
                                    color="#4E87F8"
                                    onClick={() => {
                                      setUnAssignedItems([
                                        ...unassignedItems,
                                        { ...values?.assignedItems[index], smartLineItemId: null },
                                      ])
                                      removeAssigned(index)
                                    }}
                                    cursor="pointer"
                                  ></Icon>
                                  <span>{values?.assignedItems[index]?.sku}</span>
                                </HStack>
                              </Td>
                              <Td>{values?.assignedItems[index]?.productName}</Td>
                              <Td>{values?.assignedItems[index]?.description}</Td>
                              <Td>{values?.assignedItems[index]?.quantity}</Td>
                              <Td>{values?.assignedItems[index]?.unitPrice}</Td>
                              <Td>
                                <Controller
                                  control={props.control}
                                  name={`assignedItems.${index}.isCompleted`}
                                  rules={props.rules}
                                  render={({ field, fieldState }) => (
                                    <CustomCheckBox
                                      text="Completed"
                                      isChecked={field.value}
                                      onChange={e => {
                                        field.onChange(e.currentTarget.checked)
                                      }}
                                    ></CustomCheckBox>
                                  )}
                                ></Controller>
                              </Td>
                              <Td>
                                <Controller
                                  control={props.control}
                                  name={`assignedItems.${index}.isVerified`}
                                  rules={props.rules}
                                  render={({ field, fieldState }) => (
                                    <CustomCheckBox
                                      text="Verified"
                                      isChecked={field.value}
                                      onChange={e => {
                                        field.onChange(e.currentTarget.checked)
                                      }}
                                    ></CustomCheckBox>
                                  )}
                                ></Controller>
                              </Td>
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
                              {/*<Td>
                            <Box>
                              <Button
                                pt="1"
                                variant="outline"
                                colorScheme="brand"
                                rightIcon={<Icon as={BiUpload} boxSize={3} mb="1" />}
                                size="sm"
                              >
                                {t(`${WORK_ORDER}.upload`)}
                              </Button>
                            </Box>
                              </Td>*/}

                              <Td>
                                <CustomCheckBox text="Verified" />
                              </Td>
                            </Tr>
                          )
                        })}
                      </>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </TableContainer>
          </Box>
        </>
      )}
      <RemainingItemsModal
        isOpen={isOpenRemainingItemsModal}
        onClose={onCloseRemainingItemsModal}
        setAssignedItems={setAssignedItems}
        remainingItems={unassignedItems}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default AssignedItems
