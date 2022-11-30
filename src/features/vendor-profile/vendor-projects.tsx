import React, { useMemo, useState } from 'react'
import { Box, Flex, Button, RadioGroup, Stack, Radio, VStack } from '@chakra-ui/react'
import { VendorProfile } from 'types/vendor.types'
import { useFetchVendorWorkOrders } from 'api/vendor-details'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { t } from 'i18next'
import { ColumnDef } from '@tanstack/react-table'
import { useProjectTypeSelectOptions } from 'api/pc-projects'
import { WORK_ORDER_STATUS } from 'components/chart/Overview'

type ProjectProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
  isActive: boolean
}
export const VendorProjects: React.FC<ProjectProps> = ({ vendorProfileData, onClose, isActive }) => {
  const { projectTypes } = useProjectTypeSelectOptions()

  const VENDOR_PROJECTS_TABLE_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: 'Project ID',
        accessorKey: 'projectId',
      },
      {
        header: 'Type',
        accessorKey: 'projectType',
        cell: cellInfo => {
          const { row } = cellInfo
          return projectTypes?.find(pt => pt.id === row?.original?.projectType)?.value
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: cellInfo => {
          const { row } = cellInfo
          const statusLabel = WORK_ORDER_STATUS[row?.original?.status]
          return statusLabel
        },
      },
      {
        header: 'Street Address',
        accessorKey: 'streetAddress',
      },
      {
        header: 'Pending Transactions',
        accessorKey: 'pendingTransactions',
        cell: cellInfo => {
          const { row } = cellInfo
          const pendingCount = row?.original?.childChangeOrders.filter(co => co.status === 'PENDING')?.length || 0
          return pendingCount
        },
      },
      {
        header: 'PastDue WorkOrders',
        accessorKey: 'pastDueWorkOrders',
      },
    ]
  }, [projectTypes])

  const { vendorProjects, isFetching } = useFetchVendorWorkOrders(`${vendorProfileData?.id}`)
  const [projectStatus, setProjectStatus] = useState('active')
  return (
    <VStack gap={5}>
      <RadioGroup w="100%" justifyContent={'flex-start'} onChange={setProjectStatus} value={projectStatus}>
        <Stack direction="row">
          <Radio value="active">Active</Radio>
          <Radio value="paid">Paid</Radio>
        </Stack>
      </RadioGroup>
      <Box overflow={'auto'} w="100%" h="430px" position="relative" roundedTop={6}>
        <TableContextProvider data={vendorProjects} columns={VENDOR_PROJECTS_TABLE_COLUMNS}>
          <Table isLoading={isFetching} isEmpty={!isFetching && !vendorProjects?.length} />
        </TableContextProvider>
      </Box>
      <Flex
        mt={2}
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        height="72px"
        pt="8px"
        w="100%"
        justifyContent="end"
      >
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}

        <Button type="submit" variant="solid" colorScheme="brand" data-testid="saveMarkets">
          {t('save')}
        </Button>
      </Flex>
    </VStack>
  )
}
