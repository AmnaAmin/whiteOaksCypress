import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Divider,
  HStack,
  Icon,
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
} from '@chakra-ui/react'

import { useState } from 'react'
import { Controller, FieldValues, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiXCircle } from 'react-icons/bi'
import { currencyFormatter } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableField, LineItems, SWOProject } from './assignedItems.utils'
import { FaSpinner } from 'react-icons/fa'

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
  isLoadingLineItems?: boolean
  onOpenRemainingItemsModal: () => void
  assignedItemsArray: FieldValues
  unassignedItems: LineItems[]
  setUnAssignedItems: (items) => void
  formControl: UseFormReturn
  isAssignmentAllowed: boolean
  swoProject: SWOProject
}

const AssignedItems = (props: AssignedItemType) => {
  const {
    isLoadingLineItems,
    onOpenRemainingItemsModal,
    assignedItemsArray,
    unassignedItems,
    setUnAssignedItems,
    formControl,
    isAssignmentAllowed,
    swoProject,
  } = props
  const [showLineItems] = useState(true)
  const { t } = useTranslation()
  const { control, register, setValue } = formControl

  const { fields: assignedItems } = assignedItemsArray
  const lineItems = useWatch({ name: 'assignedItems', control })
  const markAllChecked = lineItems?.length > 0 && lineItems.every(l => l.isVerified)

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

              {swoProject?.status && swoProject?.status.toUpperCase() !== 'COMPLETED' && (
                <Button variant="outline" colorScheme="brand" disabled leftIcon={<FaSpinner />}>
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
                        {assignedItems?.length < 1 && (
                          <Tr>
                            <Td colSpan={7} textAlign="center">
                              No data returned for this view
                            </Td>
                          </Tr>
                        )}
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
    </Box>
  )
}

export const AssignedLineItems = props => {
  const { setUnAssignedItems, unassignedItems } = props
  const { control, getValues } = props.formControl
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
                <EditableField
                  index={index}
                  fieldName="sku"
                  fieldArray="assignedItems"
                  formControl={props.formControl}
                  inputType="text"
                />
              </HStack>
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="productName"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="text"
              />
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="description"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="text"
              />
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="quantity"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="number"
              />
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="unitPrice"
                formControl={props.formControl}
                inputType="number"
                fieldArray="assignedItems"
                valueFormatter={currencyFormatter}
              />
            </Td>
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
