import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
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

import { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiXCircle } from 'react-icons/bi'
import NumberFormat from 'react-number-format'
import { LineItems, useAllowLineItemsAssignment, useRemainingLineItems } from './assignedItems.utils'
import { WORK_ORDER } from '../workOrder.i18n'
import RemainingItemsModal from './remaining-items-modal'

export const PriceInput = props => {
  return <Input {...props} variant="outline" size="sm" />
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
      bg={state.isChecked ? 'green.50' : '#F2F3F4'}
      cursor={!state.isDisabled ? 'pointer' : 'default'}
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
          if (!state.isDisabled) {
            props.onChange(e)
          } else return
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

type AssignedItemType = {
  assignedItems: LineItems[]
  manualItems: LineItems[]
  showPrice?: boolean
}

const AssignedItems = props => {
  const { swoProject, isLoadingLineItems, workOrder } = props
  const [showLineItems] = useState(true)
  const [unassignedItems, setUnAssignedItems] = useState<LineItems[]>([])
  const { t } = useTranslation()

  const { remainingItems, isLoading } = useRemainingLineItems(swoProject?.id)
  const formControl = useFormContext<AssignedItemType>()
  const { control, register, setValue } = formControl

  const { isAssignmentAllowed } = useAllowLineItemsAssignment(workOrder)

  const manualItemArray = useFieldArray({
    control,
    name: 'manualItems',
  })
  const { fields: manualItems, append: appendManual } = manualItemArray

  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })
  const { fields: assignedItems, append } = assignedItemsArray
  const lineItems = useWatch({ name: 'assignedItems', control })
  const markAllChecked = lineItems?.length > 0 && lineItems.every(l => l.isVerified)

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

              {isAssignmentAllowed && (
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
              )}
            </HStack>
            <HStack spacing="16px">
              <Checkbox size="lg" {...register('showPrice')}>
                {t(`${WORK_ORDER}.showPrice`)}
              </Checkbox>
              <Checkbox
                size="lg"
                isChecked={markAllChecked}
                onChange={e => {
                  assignedItems.forEach((item, index) => {
                    setValue(`assignedItems.${index}.isVerified`, e.currentTarget.checked)
                  })
                }}
              >
                {t(`${WORK_ORDER}.markAllVerified`)}
              </Checkbox>
              {/* Commented this code. Will be working on this in up coming stories.
              
              <Button variant="outline" colorScheme="brand" leftIcon={<Icon as={BiDownload} boxSize={4} />}>
                {t(`${WORK_ORDER}.downloadPDF`)}
            </Button> */}
              {isAssignmentAllowed && (
                <Button variant="outline" colorScheme="brand" onClick={onOpenRemainingItemsModal}>
                  {t(`${WORK_ORDER}.remainingItems`)}
                </Button>
              )}
            </HStack>
          </Stack>

          <Box mt="16px" border="1px solid" borderColor="gray.100" borderRadius="md">
            <TableContainer>
              <Box>
                <Table display={'block'} width={'100%'} overflow={'auto'}>
                  <Thead h="72px" position="sticky" top="0">
                    <Tr whiteSpace="nowrap">
                      <Th minW="200px">{t(`${WORK_ORDER}.sku`)}</Th>
                      <Th minW="200px">{t(`${WORK_ORDER}.productName`)}</Th>
                      <Th minW="200px">{t(`${WORK_ORDER}.details`)}</Th>
                      <Th minW="200px">{t(`${WORK_ORDER}.quantity`)}</Th>
                      <Th minW="200px">{t(`${WORK_ORDER}.price`)}</Th>
                      <Th minW="200px" textAlign={'center'}>
                        {t(`${WORK_ORDER}.status`)}
                      </Th>
                      {/* Will be working on this in upcoming stores:
                      <Th>{ t(`${WORK_ORDER}.images`)}</Th> */}
                      <Th minW="200px" textAlign={'center'}>
                        {t(`${WORK_ORDER}.verification`)}
                      </Th>
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
                        <ManualItems formControl={formControl} fieldArray={manualItemArray} />
                        <AssignedLineItems
                          formControl={formControl}
                          fieldArray={assignedItemsArray}
                          unassignedItems={unassignedItems}
                          setUnAssignedItems={setUnAssignedItems}
                        />
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

const ManualItems = props => {
  const { fields: manualItems, remove: removeManual } = props.fieldArray
  const {
    control,
    register,
    formState: { errors },
  } = props.formControl

  return (
    <>
      {manualItems.map((items, index) => {
        return (
          <Tr>
            <Td>
              <HStack position="relative" right="16px">
                <Icon
                  as={BiXCircle}
                  boxSize={5}
                  color="brand.300"
                  onClick={() => removeManual(index)}
                  cursor="pointer"
                  mt="2"
                />
                <FormControl isInvalid={errors?.manualItems && !!errors?.manualItems[index]?.sku?.message}>
                  <FormLabel></FormLabel>
                  <Input
                    size="sm"
                    id="now"
                    {...register(`manualItems.${index}.sku`, { required: 'This is required' })}
                  />
                  {errors?.manualItems && (
                    <FormErrorMessage>{errors?.manualItems[index]?.sku?.message}</FormErrorMessage>
                  )}
                </FormControl>
              </HStack>
            </Td>
            <Td>
              <FormControl isInvalid={errors?.manualItems && !!errors?.manualItems[index]?.productName?.message}>
                <FormLabel></FormLabel>
                <Input
                  size="sm"
                  id="productName"
                  {...register(`manualItems.${index}.productName`, {
                    required: 'This is required',
                  })}
                />
                {errors?.manualItems && (
                  <FormErrorMessage>{errors?.manualItems[index]?.productName?.message}</FormErrorMessage>
                )}
              </FormControl>
            </Td>
            <Td>
              <Box>
                <FormControl isInvalid={errors?.manualItems && !!errors?.manualItems[index]?.details?.message}>
                  <FormLabel></FormLabel>
                  <Input
                    size="sm"
                    id="details"
                    {...register(`manualItems.${index}.details`, { required: 'This is required' })}
                  />
                  {errors?.manualItems && (
                    <FormErrorMessage>{errors?.manualItems[index]?.sku?.message}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </Td>
            <Td>
              <FormControl isInvalid={errors?.manualItems && !!errors?.manualItems[index]?.quantity?.message}>
                <FormLabel></FormLabel>
                <Input
                  size="sm"
                  id="quantity"
                  type="number"
                  {...register(`manualItems.${index}.quantity`, { required: 'This is required' })}
                />
                {errors?.manualItems && (
                  <FormErrorMessage>{errors?.manualItems[index]?.quantity?.message}</FormErrorMessage>
                )}
              </FormControl>
            </Td>
            <Td>
              <FormControl isInvalid={errors?.manualItems && !!errors?.manualItems[index]?.price?.message}>
                <FormLabel></FormLabel>
                <Controller
                  control={control}
                  name={`manualItems.${index}.price`}
                  rules={{ required: 'This is required field' }}
                  render={({ field, fieldState }) => {
                    return (
                      <>
                        <NumberFormat
                          value={field.value}
                          onValueChange={values => {
                            const { floatValue } = values
                            field.onChange(floatValue)
                          }}
                          customInput={PriceInput}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )
                  }}
                />
              </FormControl>
            </Td>
            <Td>
              <CustomCheckBox text="Completed" isDisabled={true} isChecked={false} />
            </Td>
            {/*
                              
            Commented this code. Will be working on this in up coming stories.
            <Td>
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
              <CustomCheckBox text="Verified" isDisabled={true} isChecked={false} />
            </Td>
          </Tr>
        )
      })}
    </>
  )
}

const AssignedLineItems = props => {
  const { setUnAssignedItems, unassignedItems } = props
  const { control, getValues, register } = props.formControl
  const { fields: assignedItems, remove: removeAssigned } = props.fieldArray
  const values = getValues()
  return (
    <>
      {assignedItems.map((items, index) => {
        return (
          <Tr>
            <Td>
              <HStack position="relative" right="16px">
                <Icon
                  as={BiXCircle}
                  boxSize={5}
                  color="brand.300"
                  onClick={() => {
                    setUnAssignedItems([...unassignedItems, { ...values?.assignedItems[index] }])
                    removeAssigned(index)
                  }}
                  cursor="pointer"
                ></Icon>
                <span>{values?.assignedItems[index]?.sku}</span>
                <Input size="sm" id="now" {...register(`assignedItems.${index}.sku`)} />
              </HStack>
            </Td>
            <Td>{values?.assignedItems[index]?.productName}</Td>
            <Td>{values?.assignedItems[index]?.description}</Td>
            <Td>{values?.assignedItems[index]?.quantity}</Td>
            <Td>{values?.assignedItems[index]?.price}</Td>
            <Td>
              <Controller
                control={control}
                name={`assignedItems.${index}.isCompleted`}
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
                control={control}
                name={`assignedItems.${index}.isVerified`}
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
    </>
  )
}
export default AssignedItems
