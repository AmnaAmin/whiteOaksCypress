import { AddIcon, CheckIcon } from '@chakra-ui/icons'
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
  VStack,
} from '@chakra-ui/react'

import { useCallback, useState } from 'react'
import { Controller, FieldValues, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiDownload } from 'react-icons/bi'
import { currencyFormatter } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import {
  calculateProfit,
  calculateVendorAmount,
  EditableField,
  LineItems,
  mapToRemainingItems,
  SWOProject,
  UploadImage,
  useActionsShowDecision,
  useColumnsShowDecision,
  useFieldEnableDecision,
} from './assignedItems.utils'
import { FaSpinner } from 'react-icons/fa'
import { difference } from 'lodash'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { readFileContent } from 'api/vendor-details'
import { ProjectWorkOrderType } from 'types/project.type'

const headerStyle = {
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  color: '#4A5568',
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
  isLoadingLineItems?: boolean
  onOpenRemainingItemsModal?: () => void
  assignedItemsArray: FieldValues
  unassignedItems?: LineItems[]
  setUnAssignedItems?: (items) => void
  formControl: UseFormReturn
  isAssignmentAllowed: boolean
  swoProject?: SWOProject
  downloadPdf?: () => void
  workOrder: ProjectWorkOrderType | null
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
    downloadPdf,
    workOrder,
  } = props
  const [showLineItems] = useState(true)
  const { control, register, getValues, setValue } = formControl
  const { t } = useTranslation()
  const { fields: assignedItems, remove: removeAssigned } = assignedItemsArray

  const values = getValues()
  const [selectedRows, setSelectedRows] = useState<any>([])
  const lineItems = useWatch({ name: 'assignedItems', control })
  const markAllCompleted = lineItems?.length > 0 && lineItems.every(l => l.isCompleted)
  const { showEditablePrice, showReadOnlyPrice, showStatus, showImages, showVerification, showSelect } =
    useColumnsShowDecision({ workOrder })
  const { showPriceCheckBox, showMarkAllIsVerified, showMarkAllIsComplete } = useActionsShowDecision({ workOrder })
  const { statusEnabled, verificationEnabled } = useFieldEnableDecision({ workOrder })

  return (
    <Box>
      {showLineItems && (
        <>
          <Stack direction="row" mt="32px" justifyContent="space-between">
            <HStack>
              <Text>{t(`${WORK_ORDER}.assignedLineItems`)}</Text>
              {swoProject?.status && swoProject?.status.toUpperCase() !== 'COMPLETED' && (
                <>
                  <Box pl="2" pr="1">
                    <Divider size="lg" orientation="vertical" h="25px" />
                  </Box>
                  <Button variant="ghost" disabled colorScheme="brand" leftIcon={<FaSpinner />}>
                    {t(`${WORK_ORDER}.addNewItem`)}
                  </Button>
                </>
              )}

              {isAssignmentAllowed && (
                <>
                  <Box pl="2" pr="1">
                    <Divider size="lg" orientation="vertical" h="25px" />
                  </Box>
                  <Button
                    variant="ghost"
                    colorScheme="brand"
                    onClick={onOpenRemainingItemsModal}
                    leftIcon={<Icon as={AddIcon} boxSize={2} />}
                  >
                    {t(`${WORK_ORDER}.addNewItem`)}
                  </Button>
                  <Box pl="2" pr="1">
                    <Divider size="lg" orientation="vertical" h="25px" />
                  </Box>
                  <Button
                    variant="ghost"
                    disabled={selectedRows?.length < 1}
                    onClick={() => {
                      if (setUnAssignedItems && unassignedItems) {
                        setUnAssignedItems([
                          ...values?.assignedItems
                            ?.filter(a => selectedRows.includes(a.id))
                            ?.map(i => {
                              return mapToRemainingItems(i)
                            }),
                          ...unassignedItems,
                        ])
                        const removedItems: any = []
                        values?.assignedItems?.forEach((item, index) => {
                          if (selectedRows.includes(item.id)) {
                            removedItems.push(index)
                          }
                        })
                        removeAssigned(removedItems)
                      }
                    }}
                    colorScheme="brand"
                  >
                    {t(`${WORK_ORDER}.unassignLineItems`)}
                  </Button>
                </>
              )}
            </HStack>
            <HStack spacing="16px">
              {showPriceCheckBox && (
                <Checkbox size="md" {...register('showPrice')}>
                  {t(`${WORK_ORDER}.showPrice`)}
                </Checkbox>
              )}
              {showMarkAllIsVerified && (
                <Checkbox
                  size="md"
                  disabled={!verificationEnabled}
                  onChange={e => {
                    assignedItems.forEach((item, index) => {
                      if (values?.assignedItems?.[index]?.isCompleted) {
                        setValue(`assignedItems.${index}.isVerified`, e.currentTarget.checked)
                      }
                    })
                  }}
                >
                  {t(`${WORK_ORDER}.markAllVerified`)}
                </Checkbox>
              )}
              {showMarkAllIsComplete && (
                <Checkbox
                  size="lg"
                  disabled={!statusEnabled}
                  isChecked={markAllCompleted}
                  onChange={e => {
                    assignedItems.forEach((item, index) => {
                      setValue(`assignedItems.${index}.isCompleted`, e.currentTarget.checked)
                    })
                  }}
                >
                  {t(`${WORK_ORDER}.markAllCompleted`)}
                </Checkbox>
              )}
              {downloadPdf && (
                <Button
                  variant="outline"
                  onClick={downloadPdf}
                  colorScheme="brand"
                  disabled={assignedItems?.length < 1}
                  leftIcon={<Icon as={BiDownload} boxSize={4} />}
                >
                  {t(`${WORK_ORDER}.downloadPDF`)}
                </Button>
              )}
            </HStack>
          </Stack>

          <Box mt="16px" border="1px solid" borderColor="gray.100" borderRadius="md">
            <Box>
              <TableContainer>
                <Table width={'100%'}>
                  <Thead h="72px">
                    <Tr whiteSpace="nowrap">
                      {showSelect && (
                        <Th sx={headerStyle} w="50px">
                          <Checkbox
                            size="md"
                            isChecked={
                              values?.assignedItems?.length > 0 &&
                              difference(
                                values?.assignedItems.map(r => r.id),
                                selectedRows,
                              )?.length < 1
                            }
                            onChange={e => {
                              if (e.currentTarget.checked) {
                                const selected =
                                  values?.assignedItems?.length > 0 ? [...values?.assignedItems?.map(a => a.id)] : []
                                setSelectedRows(selected)
                              } else {
                                setSelectedRows([])
                              }
                            }}
                          ></Checkbox>
                        </Th>
                      )}
                      <Th sx={headerStyle} minW="100px" maxW="150px">
                        {t(`${WORK_ORDER}.sku`)}
                      </Th>
                      <Th sx={headerStyle} minW="200px">
                        {t(`${WORK_ORDER}.productName`)}
                      </Th>
                      <Th sx={headerStyle} minW="250px">
                        {t(`${WORK_ORDER}.details`)}
                      </Th>
                      <Th sx={headerStyle} w="70px">
                        {t(`${WORK_ORDER}.quantity`)}
                      </Th>
                      {(showReadOnlyPrice || showEditablePrice) && (
                        <>
                          <Th sx={headerStyle} w="100px">
                            {t(`${WORK_ORDER}.price`)}
                          </Th>
                          <Th sx={headerStyle} w="100px">
                            {t(`${WORK_ORDER}.clientAmount`)}
                          </Th>
                          <Th sx={headerStyle} w="70px">
                            {t(`${WORK_ORDER}.profit`)}
                          </Th>
                          <Th sx={headerStyle} w="100px">
                            {t(`${WORK_ORDER}.vendorAmount`)}
                          </Th>
                        </>
                      )}

                      {showStatus && (
                        <Th sx={headerStyle} textAlign={'center'} minW="200px">
                          {t(`${WORK_ORDER}.status`)}
                        </Th>
                      )}
                      {showImages && (
                        <Th sx={headerStyle} textAlign={'center'}>
                          {t(`${WORK_ORDER}.images`)}
                        </Th>
                      )}
                      {showVerification && (
                        <Th sx={headerStyle} textAlign={'center'} minW="200px">
                          {t(`${WORK_ORDER}.verification`)}
                        </Th>
                      )}
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
                            <Td colSpan={9} verticalAlign="middle" color={'gray.400'} h={'315px'} textAlign="center">
                              {t(`${WORK_ORDER}.emptyTableText`)}
                            </Td>
                          </Tr>
                        )}
                        <AssignedLineItems
                          formControl={formControl}
                          fieldArray={assignedItemsArray}
                          downloadPdf={downloadPdf}
                          selectedRows={selectedRows}
                          setSelectedRows={setSelectedRows}
                          workOrder={workOrder}
                        />
                      </>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export const AssignedLineItems = props => {
  const { selectedRows, setSelectedRows, workOrder } = props
  const { control, getValues, setValue, watch } = props.formControl
  const { fields: assignedItems } = props.fieldArray
  const values = getValues()
  const { showEditablePrice, showReadOnlyPrice, showStatus, showImages, showVerification, showSelect } =
    useColumnsShowDecision({ workOrder })
  const { statusEnabled, verificationEnabled } = useFieldEnableDecision({ workOrder })
  const { isVendor } = useUserRolesSelector()
  const [selectedCell, setSelectedCell] = useState('')
  const allowEdit = !isVendor && !workOrder // !workOrder temporary check till further requirements

  const watchFieldArray = watch('assignedItems')
  const controlledAssignedItems = assignedItems.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  const onFileChange = async file => {
    const fileContents = await readFileContent(file)
    const documentFile = {
      fileObjectContentType: file?.type,
      fileType: file?.name,
      fileObject: fileContents ?? '',
      documentType: 39,
    }
    return documentFile
  }

  const downloadDocument = (link, text) => {
    return (
      <a href={link} target="_blank" rel="noreferrer" download style={{ marginTop: '5px', color: '#4E87F8' }}>
        <HStack>
          <Icon as={BiDownload} size="sm" />
          <Text fontSize="12px" fontStyle="normal" maxW="100px" isTruncated>
            {text}
          </Text>
        </HStack>
      </a>
    )
  }

  const handleItemQtyChange = useCallback(
    (e, index) => {
      const price = Number(controlledAssignedItems?.[index]?.price ?? 0)
      const profit = Number(controlledAssignedItems?.[index]?.profit ?? 0)
      const newQuantity = Number(e.target.value)
      const vendorAmount = calculateVendorAmount(price * newQuantity, profit)
      setValue(`assignedItems.${index}.clientAmount`, price * newQuantity)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )

  const handleItemPriceChange = useCallback(
    (e, index) => {
      const newPrice = Number(e.target.value ?? 0)
      const profit = Number(controlledAssignedItems?.[index]?.profit ?? 0)
      const quantity = Number(controlledAssignedItems?.[index]?.quantity ?? 0)
      const vendorAmount = calculateVendorAmount(newPrice * quantity, profit)
      setValue(`assignedItems.${index}.clientAmount`, newPrice * quantity)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )

  const handleItemProfitChange = useCallback(
    (e, index) => {
      const newProfit = e.target.value ?? 0
      const clientAmount = Number(controlledAssignedItems?.[index]?.clientAmount ?? 0)
      const vendorAmount = calculateVendorAmount(clientAmount, newProfit)
      setValue(`assignedItems.${index}.vendorAmount`, vendorAmount)
    },
    [controlledAssignedItems],
  )

  const handleItemVendorAmountChange = useCallback(
    (e, index) => {
      const vendorAmount = e.target.value ?? 0
      const clientAmount = Number(controlledAssignedItems?.[index]?.clientAmount ?? 0)
      const profit = calculateProfit(clientAmount, vendorAmount)
      setValue(`assignedItems.${index}.profit`, profit)
    },
    [controlledAssignedItems],
  )

  return (
    <>
      {controlledAssignedItems?.map((items, index) => {
        return (
          <Tr>
            {showSelect && (
              <Td>
                <Checkbox
                  size="md"
                  isChecked={selectedRows?.includes(values?.assignedItems?.[index]?.id)}
                  onChange={e => {
                    if (e.currentTarget?.checked) {
                      if (!selectedRows?.includes(values?.assignedItems?.[index]?.id)) {
                        setSelectedRows([...selectedRows, values?.assignedItems?.[index]?.id])
                      }
                    } else {
                      setSelectedRows([...selectedRows.filter(s => s !== values?.assignedItems?.[index]?.id)])
                    }
                  }}
                ></Checkbox>
              </Td>
            )}
            <Td>
              <EditableField
                index={index}
                fieldName="sku"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="text"
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                allowEdit={allowEdit}
              />
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="productName"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="text"
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                allowEdit={allowEdit}
              />
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="description"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="text"
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                allowEdit={allowEdit}
              />
            </Td>
            <Td>
              <EditableField
                index={index}
                fieldName="quantity"
                fieldArray="assignedItems"
                formControl={props.formControl}
                inputType="number"
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                allowEdit={allowEdit}
                onChange={e => {
                  handleItemQtyChange(e, index)
                }}
              />
            </Td>
            {showEditablePrice && (
              <>
                <Td>
                  <EditableField
                    index={index}
                    fieldName="price"
                    formControl={props.formControl}
                    inputType="number"
                    fieldArray="assignedItems"
                    valueFormatter={currencyFormatter}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                    allowEdit={true}
                    onChange={e => {
                      handleItemPriceChange(e, index)
                    }}
                  />
                </Td>
                <Td>
                  <EditableField
                    index={index}
                    fieldName="clientAmount"
                    formControl={props.formControl}
                    inputType="number"
                    fieldArray="assignedItems"
                    valueFormatter={currencyFormatter}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                    allowEdit={false}
                  ></EditableField>
                </Td>
                <Td>
                  <EditableField
                    index={index}
                    fieldName="profit"
                    formControl={props.formControl}
                    inputType="number"
                    fieldArray="assignedItems"
                    valueFormatter={val => {
                      if (val !== null || val !== '') return val + '%'
                      else return val
                    }}
                    onChange={e => {
                      handleItemProfitChange(e, index)
                    }}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                    allowEdit={true}
                  />
                </Td>
                <Td>
                  <EditableField
                    index={index}
                    fieldName="vendorAmount"
                    formControl={props.formControl}
                    inputType="number"
                    fieldArray="assignedItems"
                    valueFormatter={currencyFormatter}
                    onChange={e => {
                      handleItemVendorAmountChange(e, index)
                    }}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                    allowEdit={true}
                  />
                </Td>
              </>
            )}
            {showReadOnlyPrice && (
              <>
                <Td>
                  <Box>{currencyFormatter(values?.assignedItems[index]?.price)}</Box>
                </Td>
                <Td>
                  <Box>{currencyFormatter(values?.assignedItems[index]?.clientAmount)}</Box>
                </Td>
                <Td>
                  <Box>{values?.assignedItems[index]?.profit ? values?.assignedItems[index]?.profit + '%' : ''}</Box>
                </Td>
                <Td>
                  <Box>{currencyFormatter(values?.assignedItems[index]?.vendorAmount)}</Box>
                </Td>
              </>
            )}

            {showStatus && (
              <Td>
                <HStack justifyContent={'center'} h="50px">
                  <Controller
                    control={control}
                    name={`assignedItems.${index}.isCompleted`}
                    render={({ field, fieldState }) => (
                      <CustomCheckBox
                        text="Completed"
                        isChecked={field.value}
                        disabled={!statusEnabled}
                        onChange={e => {
                          if (!e.target.checked) {
                            setValue(`assignedItems.${index}.isVerified`, false)
                          }
                          field.onChange(e.currentTarget.checked)
                        }}
                      ></CustomCheckBox>
                    )}
                  ></Controller>
                </HStack>
              </Td>
            )}
            {showImages && (
              <Td>
                <Controller
                  name={`assignedItems.${index}.uploadedDoc`}
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <VStack gap="1px">
                        <Box>
                          <UploadImage
                            label={`upload`}
                            value={field?.value?.fileType}
                            onChange={async (file: any) => {
                              const document = await onFileChange(file)
                              field.onChange(document)
                            }}
                            onClear={() => setValue(field.name, null)}
                          ></UploadImage>
                        </Box>

                        {assignedItems[index]?.document?.s3Url && (
                          <Box>
                            {downloadDocument(
                              values.assignedItems[index]?.document?.s3Url,
                              values.assignedItems[index]?.document?.fileType,
                            )}
                          </Box>
                        )}
                      </VStack>
                    )
                  }}
                />
              </Td>
            )}
            {showVerification && (
              <Td>
                <HStack justifyContent={'center'} h="50px">
                  <Controller
                    control={control}
                    name={`assignedItems.${index}.isVerified`}
                    render={({ field, fieldState }) => (
                      <CustomCheckBox
                        text="Verified"
                        disabled={!(values.assignedItems?.[index]?.isCompleted && verificationEnabled)}
                        isChecked={field.value}
                        onChange={e => {
                          field.onChange(e.currentTarget.checked)
                        }}
                      ></CustomCheckBox>
                    )}
                  ></Controller>
                </HStack>
              </Td>
            )}
          </Tr>
        )
      })}
    </>
  )
}

export default AssignedItems
