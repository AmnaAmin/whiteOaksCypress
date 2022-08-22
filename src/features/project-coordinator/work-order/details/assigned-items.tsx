import { CheckIcon } from '@chakra-ui/icons'
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
import { WORK_ORDER } from 'features/project-coordinator/work-order/workOrder.i18n'
import { useCallback, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiUpload, BiXCircle } from 'react-icons/bi'
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
  const { swoProject, workOrder } = props
  const [showLineItems] = useState(true)
  const { t } = useTranslation()

  const { mutate: unAssignLineItem } = useAssignLineItems({ swoProjectId: swoProject?.id, workOrder })
  const { control, register, getValues, setValue } = useFormContext<any>()

  const { fields: manualItems, remove } = useFieldArray({
    control,
    name: 'manualItems',
  })

  const { fields: assignedItems, append } = useFieldArray({
    control,
    name: 'assignedItems',
  })

  const {
    onClose: onCloseRemainingItemsModal,
    isOpen: isOpenRemainingItemsModal,
    onOpen: onOpenRemainingItemsModal,
  } = useDisclosure()

  const setAssignedItems = useCallback(
    items => {
      append(items)
    },
    [assignedItems],
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
              {/*<Button
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
                {t(`${WORK_ORDER}.addNewItem`)}
              </Button>*/}
            </HStack>
            <HStack spacing="16px">
              <Checkbox size="lg" {...register('showPrice')}>
                {t(`${WORK_ORDER}.showPrice`)}
              </Checkbox>
              <Checkbox
                size="lg"
                isChecked={
                  getValues('assignedItems')?.length > 0 &&
                  getValues('assignedItems').every(e => {
                    return e.verification
                  })
                }
                onChange={e => {
                  getValues('assignedItems').forEach((item, index) => {
                    setValue(`assignedItems.${index}.verification`, e.currentTarget.checked)
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
                  <Thead h="72px" zIndex="1" position="sticky" top="0">
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
                                onClick={() => unAssignLineItem(getValues(`assignedItems.${index}.sku`))}
                                cursor="pointer"
                              ></Icon>
                              <span>{getValues(`assignedItems.${index}.sku`)}</span>
                            </HStack>
                          </Td>
                          <Td>{getValues(`assignedItems.${index}.productName`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.description`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.quantity`)}</Td>
                          <Td>{getValues(`assignedItems.${index}.unitPrice`)}</Td>
                          <Td>
                            <CustomCheckBox
                              text="Completed"
                              isChecked={getValues(`assignedItems.${index}.status`)}
                              onChange={() => {
                                setValue(`assignedItems.${index}.status`, !getValues(`assignedItems.${index}.status`))
                              }}
                            />
                          </Td>
                          <Td>
                            <CustomCheckBox
                              text="Verified"
                              isChecked={getValues(`assignedItems.${index}.verification`)}
                              onChange={() => {
                                setValue(
                                  `assignedItems.${index}.verification`,
                                  !getValues(`assignedItems.${index}.verification`),
                                )
                              }}
                            />
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
        swoProject={swoProject}
        isOpen={isOpenRemainingItemsModal}
        onClose={onCloseRemainingItemsModal}
        workOrder={workOrder}
        setAssignedItems={setAssignedItems}
      />
    </Box>
  )
}

export default AssignedItems
