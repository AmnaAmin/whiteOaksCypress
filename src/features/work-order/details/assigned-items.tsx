import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Divider,
  HStack,
  Icon,
  ResponsiveValue,
  Stack,
  Text,
  useCheckbox,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiDownload } from 'react-icons/bi'
import { WORK_ORDER } from '../workOrder.i18n'
import {
  LineItems,
  SWOProject,
  useActionsShowDecision,
  useFieldEnableDecision,
  useGetLineItemsColumn,
} from './assignedItems.utils'
import { FaSpinner } from 'react-icons/fa'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { ProjectWorkOrderType } from 'types/project.type'
import { RiErrorWarningLine } from 'react-icons/ri'
import { datePickerFormat } from 'utils/date-time-utils'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'

export const CustomCheckBox = props => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

  return (
    <chakra.label
      display="flex"
      alignItems="center"
      gridColumnGap={3}
      w="125px"
      h="34px"
      rounded="8px"
      cursor={!state.isDisabled ? 'pointer' : 'default'}
      {...htmlProps}
    >
      <input {...getInputProps()} hidden id={props.id} />
      <HStack
        ml="2"
        justifyContent="center"
        border={state.isChecked ? '2px solid #48BB78' : '2px solid #E2E8F0'}
        rounded="2px"
        w={4}
        id={props.id}
        h={4}
        data-testid={props?.testid}
        {...getCheckboxProps()}
        onChange={e => {
          if (!state.isDisabled) {
            props.onChange(e)
          } else return
        }}
      >
        {state.isChecked && <Icon as={CheckIcon} boxSize="3" color={state.isChecked ? '#48BB78' : '#A0AEC0'} />}
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
  const { control, register, getValues, setValue, watch } = formControl
  const { t } = useTranslation()
  const { fields: assignedItems } = assignedItemsArray
  const [overflowXVal, setOverflowXVal] = useState<ResponsiveValue<any> | undefined>('auto')

  const values = getValues()

  const lineItems = useWatch({ name: 'assignedItems', control })
  const watchUploadWO = watch('uploadWO')
  const markAllCompleted = lineItems?.length > 0 && lineItems.every(l => l.isCompleted)

  useEffect(() => {
    const allVerified = lineItems?.length > 0 && lineItems?.every(l => l.isCompleted && l.isVerified)
    const isAnyItemComplete = lineItems?.length > 0 && lineItems?.some(l => l.isCompleted)
    if (allVerified) {
      if (!workOrder?.workOrderDateCompleted) {
        setValue('workOrderDateCompleted', datePickerFormat(new Date()))
      }
      setMarkAllVerified(true)
    }
    if (!isAnyItemComplete) {
      setMarkAllVerified(false)
    }
  }, [lineItems])

  const { showPriceCheckBox, showMarkAllIsVerified, showMarkAllIsComplete } = useActionsShowDecision({ workOrder })
  const { statusEnabled, verificationEnabled } = useFieldEnableDecision({ workOrder, lineItems })
  const { isVendor } = useUserRolesSelector()
  const [markAllVerified, setMarkAllVerified] = useState<boolean>()
  const allowEdit = !isVendor && !workOrder

  const ASSIGNED_ITEMS_COLUMNS = useGetLineItemsColumn({
    unassignedItems,
    setUnAssignedItems,
    formControl,
    allowEdit,
    assignedItemsArray,
    workOrder,
  })

  const handleOnDragEnd = useCallback(
    result => {
      if (!result.destination) return

      const items = Array.from(values.assignedItems)
      const {
        source: { index: sourceIndex },
        destination: { index: destinationIndex },
      } = result

      const [reorderedItem] = items.splice(sourceIndex, 1)
      items.splice(destinationIndex, 0, reorderedItem)

      setValue('assignedItems', items)
      setOverflowXVal('auto')
    },
    [values?.assignedItems],
  )

  const handleOnDragStart = useCallback(result => {
    setOverflowXVal('hidden')
  }, [])

  return (
    <Box>
      <>
        <Stack
          mb={'20px'}
          direction="row"
          flexWrap="wrap"
          experimental_spaceY={{ base: 5, md: 'unset' }}
          justifyContent={{ base: 'center', md: 'space-between' }}
        >
          <HStack alignItems={{ base: 'start', sm: 'center' }} ml={1} mb={2} flexWrap="wrap">
            <Text fontWeight={500} color="gray.700" fontSize={'18px'} whiteSpace="nowrap">
              {t(`${WORK_ORDER}.assignedLineItems`)}
            </Text>
            {swoProject?.status && swoProject?.status.toUpperCase() !== 'COMPLETED' && (
              <>
                <Box pl="2" pr="1">
                  <Divider size="lg" orientation="vertical" h="25px" />
                </Box>
                <Button
                  variant="unClickable"
                  onClick={e => e.preventDefault()}
                  colorScheme="brand"
                  leftIcon={<FaSpinner />}
                >
                  {t(`${WORK_ORDER}.itemsLoading`)}
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
                  data-testid="addItemsBtn"
                  colorScheme="brand"
                  onClick={onOpenRemainingItemsModal}
                  disabled={!!watchUploadWO}
                  leftIcon={<Icon as={AddIcon} boxSize={2} />}
                >
                  {t(`${WORK_ORDER}.addNewItem`)}
                </Button>
              </>
            )}
          </HStack>
          <HStack
            experimental_spaceX={{ base: '5px', lg: '16px' }}
            experimental_spaceY={{ base: '5px', sm: '0' }}
            alignItems="center"
            justifyContent={{ base: 'center', sm: 'space-between', lg: 'end' }}
            w={{ base: '100%', lg: 'unset' }}
            flexWrap="wrap"
          >
            {showPriceCheckBox && (
              <Checkbox variant={'outLineGreen'} data-testid="showPriceCheckBox" size="md" {...register('showPrice')}>
                {t(`${WORK_ORDER}.showPrice`)}
              </Checkbox>
            )}
            {showMarkAllIsVerified && (
              <HStack spacing={'2px'}>
                <Checkbox
                  data-testid="showMarkAllIsVerified"
                  size="md"
                  variant={'outLinePrimary'}
                  disabled={!verificationEnabled}
                  isChecked={markAllVerified}
                  onChange={e => {
                    assignedItems.forEach((item, index) => {
                      if (values?.assignedItems?.[index]?.isCompleted) {
                        setValue(`assignedItems.${index}.isVerified`, e.currentTarget.checked)
                      }
                    })
                    setMarkAllVerified(e.target.checked)
                  }}
                  whiteSpace="nowrap"
                >
                  {t(`${WORK_ORDER}.markAllVerified`)}
                </Checkbox>
                <Icon
                  as={RiErrorWarningLine}
                  title="Only completed items can be verified"
                  color="#4299E1"
                  boxSize={4}
                />
              </HStack>
            )}
            {showMarkAllIsComplete && (
              <Checkbox
                data-testid="showMarkAllIsComplete"
                disabled={!statusEnabled}
                isChecked={markAllCompleted}
                variant={'outLinePrimary'}
                onChange={e => {
                  assignedItems.forEach((item, index) => {
                    setValue(`assignedItems.${index}.isCompleted`, e.currentTarget.checked)
                  })
                }}
                whiteSpace="nowrap"
              >
                <Text fontSize="16px">{t(`${WORK_ORDER}.markAllCompleted`)}</Text>
              </Checkbox>
            )}
            {downloadPdf && (
              <Button
                variant="outline"
                data-testid="downloadPdf"
                onClick={downloadPdf}
                colorScheme="darkPrimary"
                disabled={assignedItems?.length < 1}
                leftIcon={<Icon as={BiDownload} boxSize={4} />}
              >
                {t(`${WORK_ORDER}.downloadPDF`)}
              </Button>
            )}
          </HStack>
        </Stack>

        <Box width="100%" height={'100%'} overflowX={overflowXVal} overflowY={'hidden'}>
          <TableContextProvider data={values.assignedItems} columns={ASSIGNED_ITEMS_COLUMNS}>
            <Table
              handleOnDrag={handleOnDragEnd}
              handleOnDragStart={handleOnDragStart}
              isLoading={isLoadingLineItems}
              isEmpty={!isLoadingLineItems && !values.assignedItems?.length}
              isHideFilters={true}
            />
          </TableContextProvider>
        </Box>
      </>
    </Box>
  )
}

export default AssignedItems
