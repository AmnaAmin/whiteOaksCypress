import { Box, Checkbox, HStack, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { t } from 'i18next'
import { FieldValue, UseFormReturn } from 'react-hook-form'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableCell, LineItems } from './assignedItems.utils'

type RemainingListType = {
  setSelectedItems: (items) => void
  selectedItems: LineItems[]
  remainingFieldArray: FieldValue<any>
  isLoading?: boolean
  formControl: UseFormReturn<any>
}
const RemainingListTable = (props: RemainingListType) => {
  const { selectedItems, setSelectedItems, isLoading, remainingFieldArray, formControl } = props
  const { fields: remainingItems } = remainingFieldArray
  const { getValues } = formControl
  const values = getValues()

  return (
    <Box mt="16px" border="1px solid" borderColor="gray.100" borderRadius="md">
      <TableContainer>
        <Box>
          <Table display={'block'} minH={'350px'} width={'100%'} overflow={'auto'}>
            <Thead h="72px" position="sticky" top="0">
              <Tr whiteSpace="nowrap">
                <Th minW="200px">
                  <HStack gap={'10px'} justifyContent="start">
                    <Checkbox
                      size="md"
                      onChange={e => {
                        if (e.currentTarget?.checked) {
                          setSelectedItems([...values.remainingItems])
                        } else {
                          setSelectedItems([])
                        }
                      }}
                    ></Checkbox>
                    <span>{t(`${WORK_ORDER}.sku`)}</span>
                  </HStack>
                </Th>
                <Th minW="200px">{t(`${WORK_ORDER}.productName`)}</Th>
                <Th minW="200px">{t(`${WORK_ORDER}.details`)}</Th>
                <Th minW="200px">{t(`${WORK_ORDER}.quantity`)}</Th>
                <Th minW="200px">{t(`${WORK_ORDER}.price`)}</Th>
                <Th minW="200px">{t(`${WORK_ORDER}.total`)}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={7} textAlign="center">
                    <Spinner size="md" />
                  </Td>
                </Tr>
              ) : (
                <>
                  {remainingItems?.length < 1 && (
                    <Tr>
                      <Td border="none" colSpan={7} textAlign="center">
                        No data returned for this view
                      </Td>
                    </Tr>
                  )}
                  {remainingItems?.map((items, index) => {
                    return (
                      <Tr>
                        <Td>
                          <HStack gap={'10px'}>
                            <Checkbox
                              size="md"
                              isChecked={selectedItems.map(s => s.id).includes(values.remainingItems[index]?.id)}
                              onChange={e => {
                                if (e.currentTarget?.checked) {
                                  if (!selectedItems.map(s => s.id).includes(values.remainingItems[index]?.id)) {
                                    setSelectedItems([...selectedItems, values.remainingItems[index]])
                                  }
                                } else {
                                  setSelectedItems([
                                    ...selectedItems.filter(s => s.id !== values.remainingItems[index]?.id),
                                  ])
                                }
                              }}
                            ></Checkbox>
                            <EditableCell
                              index={index}
                              fieldName="sku"
                              formControl={props.formControl}
                              inputType="text"
                              fieldArray="remainingItems"
                            />
                          </HStack>
                        </Td>
                        <Td>
                          <EditableCell
                            index={index}
                            fieldName="productName"
                            formControl={props.formControl}
                            inputType="text"
                            fieldArray="remainingItems"
                          />
                        </Td>
                        <Td>
                          <EditableCell
                            index={index}
                            fieldName="description"
                            formControl={props.formControl}
                            inputType="text"
                            fieldArray="remainingItems"
                          />
                        </Td>
                        <Td>
                          <EditableCell
                            index={index}
                            fieldName="quantity"
                            formControl={props.formControl}
                            inputType="text"
                            fieldArray="remainingItems"
                          />
                        </Td>
                        <Td>
                          <EditableCell
                            index={index}
                            fieldName="unitPrice"
                            formControl={props.formControl}
                            inputType="text"
                            fieldArray="remainingItems"
                          />
                        </Td>
                        <Td>
                          <EditableCell
                            index={index}
                            fieldName="totalPrice"
                            formControl={props.formControl}
                            inputType="text"
                            fieldArray="remainingItems"
                          />
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
  )
}

export default RemainingListTable
