import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, Button, RadioGroup, Stack, Radio, VStack } from '@chakra-ui/react'
import { VendorProjectType } from 'types/vendor.types'
import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { t } from 'i18next'
import { ColumnDef } from '@tanstack/react-table'
import { useProjectTypeSelectOptions } from 'api/pc-projects'
import { WORK_ORDER_STATUS } from 'components/chart/Overview'
import { isBefore } from 'date-fns'
import { ButtonsWrapper, CustomDivider, TableFooter } from 'components/table-refactored/table-footer'
import { ExportButton } from 'components/table-refactored/export-button'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings-refactored'
import TableColumnSettings from 'components/table/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

type ProjectProps = {
  onClose?: () => void
  vendorProjects: Array<VendorProjectType>
  isFetching: boolean
  isLoading: boolean
}
export const VendorProjects: React.FC<ProjectProps> = ({ vendorProjects, onClose, isFetching, isLoading }) => {
  const { projectTypes } = useProjectTypeSelectOptions()
  const { isFPM } = useUserRolesSelector()

  const VENDOR_PROJECTS_TABLE_COLUMNS: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: 'projectId',
        accessorKey: 'projectId',
      },
      {
        header: 'type',
        accessorKey: 'projectTypeValue',
      },
      {
        header: 'status',
        accessorKey: 'statusLabel',
      },
      {
        header: 'streetAddress',
        accessorKey: 'streetAddress',
      },
      {
        header: 'pendingTransactions',
        accessorKey: 'pendingCount',
      },
      {
        header: 'pastDue',
        accessorKey: 'isPastDue',
      },
    ]
  }, [projectTypes])

  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.vendorProjects)
  const { tableColumns, settingColumns } = useTableColumnSettings(
    VENDOR_PROJECTS_TABLE_COLUMNS,
    TableNames.vendorProjects,
  )

  const [projectStatus, setProjectStatus] = useState('active')
  const [tableData, setTableData] = useState([])

  const filterProject = project => {
    if (projectStatus === 'paid' && project.status === WORK_ORDER_STATUS.Paid) return project
    else if (
      projectStatus === 'active' &&
      [WORK_ORDER_STATUS.Active, WORK_ORDER_STATUS.Completed].includes(project.status)
    )
      return project
  }

  const mapToProjectsTable = data => {
    return data?.map(vp => {
      return {
        ...vp,
        projectId: vp.projectId,
        projectTypeValue: projectTypes?.find(pt => pt.id === vp?.projectType)?.value,
        statusLabel: WORK_ORDER_STATUS[vp.status],
        isPastDue: isBefore(new Date(vp.workOrderExpectedCompletionDate), new Date()) ? 'true' : 'false',
        pendingCount: vp.childChangeOrders.filter(co => co.status === 'PENDING')?.length || 0,
      }
    })
  }

  useEffect(() => {
    const data = vendorProjects?.filter(filterProject)
    const mappedData = mapToProjectsTable(data)
    setTableData(mappedData)
  }, [vendorProjects, projectStatus])

  const onSave = (columns: any) => {
    postGridColumn(columns)
  }

  return (
    <VStack gap={5}>
      <RadioGroup w="100%" justifyContent={'flex-start'} onChange={setProjectStatus} value={projectStatus}>
        <Stack direction="row">
          <Radio value="active" isDisabled={isFPM}>
            {t('active')}
          </Radio>
          <Radio value="paid" isDisabled={isFPM}>
            {t('paid')}
          </Radio>
        </Stack>
      </RadioGroup>
      <Box
        overflow={'auto'}
        w="100%"
        h="430px"
        position="relative"
        roundedTop={6}
        pointerEvents={isFPM ? 'none' : 'auto'}
      >
        <TableContextProvider data={tableData} columns={tableColumns}>
          <Table isLoading={isFetching || isLoading} isEmpty={!isFetching && !tableData?.length} />
          <TableFooter position="sticky" bottom="0" left="0" right="0">
            <ButtonsWrapper>
              <ExportButton columns={tableColumns} fetchedData={tableData} colorScheme="brand" fileName="projects" />
              <CustomDivider />
              {settingColumns && (
                <TableColumnSettings
                  disabled={isFetching || isLoading || isFPM}
                  onSave={onSave}
                  columns={settingColumns}
                />
              )}
            </ButtonsWrapper>
          </TableFooter>
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
          <Button variant={isFPM ? 'solid' : 'outline'} colorScheme="brand" onClick={onClose} mr="3">
            {t('cancel')}
          </Button>
        )}
        {!isFPM && (
          <Button type="submit" variant="solid" colorScheme="brand" data-testid="saveMarkets" isDisabled={isFPM}>
            {t('save')}
          </Button>
        )}
      </Flex>
    </VStack>
  )
}
