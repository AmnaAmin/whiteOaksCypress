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

import { useState } from 'react'
import { Controller, FieldValues, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiDownload } from 'react-icons/bi'
import { currencyFormatter } from 'utils/string-formatters'
import { WORK_ORDER } from '../workOrder.i18n'
import { EditableField, LineItems, mapToRemainingItems, SWOProject, UploadImage } from './assignedItems.utils'
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
  const { isVendor } = useUserRolesSelector()
  const watchClientApprovedAmount = useWatch({ name: 'clientApprovedAmount', control })
  const lineItems = useWatch({ name: 'assignedItems', control })
  const markAllCompleted = lineItems?.length > 0 && lineItems.every(l => l.isCompleted)

  return (
    <Box>
      {showLineItems && (
        <>
          <Stack direction="row" mt="32px" justifyContent="space-between">
            <HStack>
              <Text>{t(`${WORK_ORDER}.assignedLineItems`)}</Text>ss
              {isAssignmentAllowed && (
                <>
                  <Box pl="2" pr="1">
                    <Divider size="lg" orientation="vertical" h="25px" />
                  </Box>
                  <Button
                    variant="ghost"
                    disabled={!workOrder && !watchClientApprovedAmount}
                    colorScheme="brand"
                    onClick={onOpenRemainingItemsModal}
                    leftIcon={<Icon as={AddIcon} boxSize={2} />}
                  >
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
              {!isVendor && (
                <Checkbox size="md" {...register('showPrice')}>
                  {t(`${WORK_ORDER}.showPrice`)}
                </Checkbox>
              )}
              {!isVendor && workOrder && (
                <Checkbox
                  size="md"
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
              {isVendor && (
                <Checkbox
                  size="lg"
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
                <Table width={'100%'} overflow={'auto'}>
                  <Thead h="72px" position="sticky" top="0">
                    <Tr whiteSpace="nowrap">
                      {!isVendor && (
                        <Th sx={headerStyle} minW="50px">
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
                      <Th sx={headerStyle} minW="200px">
                        {t(`${WORK_ORDER}.sku`)}
                      </Th>
                      <Th sx={headerStyle} minW="200px">
                        {t(`${WORK_ORDER}.productName`)}
                      </Th>
                      <Th sx={headerStyle} minW="200px">
                        {t(`${WORK_ORDER}.details`)}
                      </Th>
                      <Th sx={headerStyle} minW="100px">
                        {t(`${WORK_ORDER}.quantity`)}
                      </Th>
                      {!isVendor && (
                        <Th sx={headerStyle} minW="100px">
                          {t(`${WORK_ORDER}.price`)}
                        </Th>
                      )}
                      <Th sx={headerStyle} minW="100px">
                        {t(`${WORK_ORDER}.total`)}
                      </Th>
                      {isVendor && !!values.showPrice && (
                        <Th sx={headerStyle} minW="100px">
                          {t(`${WORK_ORDER}.price`)}
                        </Th>
                      )}
                      {workOrder && (
                        <Th sx={headerStyle} textAlign={'center'} minW="200px">
                          {t(`${WORK_ORDER}.status`)}
                        </Th>
                      )}
                      {workOrder && (
                        <Th sx={headerStyle} textAlign={'center'}>
                          {t(`${WORK_ORDER}.images`)}
                        </Th>
                      )}
                      {!isVendor && workOrder && (
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
                            <Td colSpan={7} textAlign="center">
                              No data returned for this view
                            </Td>
                          </Tr>
                        )}
                        <AssignedLineItems
                          formControl={formControl}
                          fieldArray={assignedItemsArray}
                          downloadPdf={downloadPdf}
                          selectedRows={selectedRows}
                          setSelectedRows={setSelectedRows}
                          isVendor={isVendor}
                          workOrder={workOrder}
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
  const { selectedRows, setSelectedRows, isVendor, workOrder } = props
  const { control, getValues, setValue } = props.formControl
  const { fields: assignedItems } = props.fieldArray
  const values = getValues()

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

  return (
    <>
      {assignedItems?.map((items, index) => {
        return (
          <Tr>
            {!isVendor && (
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
              {!isVendor ? (
                <EditableField
                  index={index}
                  fieldName="sku"
                  fieldArray="assignedItems"
                  formControl={props.formControl}
                  inputType="text"
                />
              ) : (
                <Box>{values?.assignedItems[index]?.sku}</Box>
              )}
            </Td>
            <Td>
              {!isVendor ? (
                <EditableField
                  index={index}
                  fieldName="productName"
                  fieldArray="assignedItems"
                  formControl={props.formControl}
                  inputType="text"
                />
              ) : (
                <Box>{values?.assignedItems[index]?.productName}</Box>
              )}
            </Td>
            <Td>
              {!isVendor ? (
                <EditableField
                  index={index}
                  fieldName="description"
                  fieldArray="assignedItems"
                  formControl={props.formControl}
                  inputType="text"
                />
              ) : (
                <Box>{values?.assignedItems[index]?.description}</Box>
              )}
            </Td>
            <Td>
              {!isVendor ? (
                <EditableField
                  index={index}
                  fieldName="quantity"
                  fieldArray="assignedItems"
                  formControl={props.formControl}
                  inputType="number"
                />
              ) : (
                <Box>{values?.assignedItems[index]?.quantity}</Box>
              )}
            </Td>
            {!isVendor && (
              <Td>
                <EditableField
                  index={index}
                  fieldName="price"
                  formControl={props.formControl}
                  inputType="number"
                  fieldArray="assignedItems"
                  valueFormatter={currencyFormatter}
                />
              </Td>
            )}
            {isVendor && values.showPrice && (
              <Td>
                <Box>{currencyFormatter(values?.assignedItems[index]?.price)}</Box>
              </Td>
            )}
            {
              <Td>
                <Box>
                  {currencyFormatter(
                    (values?.assignedItems?.[index]?.price ?? 0) * values?.assignedItems?.[index]?.quantity ?? 0,
                  )}
                </Box>
              </Td>
            }
            {workOrder && (
              <Td>
                <HStack justifyContent={'center'} h="50px">
                  <Controller
                    control={control}
                    name={`assignedItems.${index}.isCompleted`}
                    render={({ field, fieldState }) => (
                      <CustomCheckBox
                        text="Completed"
                        isChecked={field.value}
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
            {workOrder && (
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
            {!isVendor && workOrder && (
              <Td>
                <HStack justifyContent={'center'} h="50px">
                  <Controller
                    control={control}
                    name={`assignedItems.${index}.isVerified`}
                    render={({ field, fieldState }) => (
                      <CustomCheckBox
                        text="Verified"
                        disabled={!values.assignedItems?.[index]?.isCompleted}
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
