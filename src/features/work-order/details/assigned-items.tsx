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
import { LineItems, SWOProject, useActionsShowDecision, useGetLineItemsColumn } from './assignedItems.utils'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { ProjectWorkOrderType } from 'types/project.type'
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

  useEffect(() => {
    const allVerified = lineItems?.length > 0 && lineItems?.every(l => l.isCompleted && l.isVerified)

    if (allVerified) {
      if (!workOrder?.workOrderDateCompleted) {
        setValue('workOrderDateCompleted', datePickerFormat(new Date()))
      }
    }
  }, [lineItems])

  const { showPriceCheckBox, notifyVendorCheckBox } = useActionsShowDecision({ workOrder })

  const { isVendor } = useUserRolesSelector()

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
          justifyContent={{ base: 'center', md: 'space-between' }}
          experimental_spaceY={{ base: '16px', sm: '0px' }}
          sx={{
            '@media only screen and (min-width: 415px)': {
              experimental_spaceY: '0',
            },
          }}
        >
          <HStack
            alignItems={{ base: 'start', sm: 'center' }}
            justifyContent={{ base: 'center', sm: 'space-between' }}
            experimental_spaceY={{ base: '16px', sm: '0px' }}
            sx={{
              '@media only screen and (min-width: 415px)': {
                experimental_spaceY: '0',
              },
            }}
            ml={1}
            flexWrap="wrap"
            w={{ base: '100%', lg: 'unset' }}
          >
            <Text fontWeight={500} color="gray.700" fontSize={'16px'} whiteSpace="nowrap">
              {t(`${WORK_ORDER}.assignedLineItems`)}
            </Text>
            {swoProject?.status && ['PROCESSING'].includes(swoProject?.status.toUpperCase()) && (
              <>
                <Box pl="2" pr="1" display={{ base: 'none', sm: 'unset' }}>
                  <Divider size="lg" orientation="vertical" h="25px" />
                </Box>
                <Button
                  loadingText={t(`${WORK_ORDER}.itemsLoading`)}
                  variant="unClickable"
                  onClick={e => e.preventDefault()}
                  colorScheme="brand"
                  isLoading={true}
                ></Button>
              </>
            )}

            {isAssignmentAllowed && (
              <>
                <Box pl="2" pr="1" display={{ base: 'none', sm: 'unset' }}>
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
            experimental_spaceY={{ base: '16px', sm: '0' }}
            sx={{
              '@media only screen and (min-width: 415px)': {
                experimental_spaceY: '0',
              },
            }}
            alignItems="center"
            justifyContent={{ base: 'center', sm: 'space-between', lg: 'end' }}
            w={{ base: '100%', lg: 'unset' }}
            flexWrap={{ base: 'wrap', lg: 'unset' }}
          >
            {!isVendor && (
              <Checkbox
                isDisabled={workOrder?.visibleToVendor}
                variant={'outLinePrimary'}
                data-testid="assignToVendor"
                size="md"
                {...register('assignToVendor')}
              >
                {t(`${WORK_ORDER}.assignVendor`)}
              </Checkbox>
            )}

            {showPriceCheckBox && (
              <Checkbox variant={'outLinePrimary'} data-testid="showPriceCheckBox" size="md" {...register('showPrice')}>
                {t(`${WORK_ORDER}.showPrice`)}
              </Checkbox>
            )}
            {notifyVendorCheckBox && (
              <Checkbox
                defaultChecked
                variant={'outLinePrimary'}
                data-testid="notifyVendorCheckBox"
                size="md"
                {...register('notifyVendor')}
              >
                {t(`${WORK_ORDER}.sendNotification`)}
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

        <Box
          width="100%"
          overflowX={overflowXVal}
          overflowY={'hidden'}
          borderRadius={5}
          borderTop="1px solid #CBD5E0"
          borderRight="1px solid #CBD5E0"
          borderLeft="1px solid #CBD5E0"
        >
          <TableContextProvider data={values.assignedItems} columns={ASSIGNED_ITEMS_COLUMNS as any}>
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
