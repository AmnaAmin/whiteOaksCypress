import React, { useEffect, useState } from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import { Link } from 'react-router-dom'
import { useProjects, useWeekDayProjectsDue } from 'utils/projects'
import Status from '../projects/status'
import { Column } from 'react-table'
import { dateFormat } from 'utils/date-time-utils'
import numeral from 'numeral'

export const PROJECT_COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'General Labor',
    accessor: 'generalLabourName',
  },
  {
    Header: 'FPM',
    accessor: 'projectManager',
  },
  {
    Header: 'Status',
    accessor: 'projectStatus',
    Cell: ({ value, row }) => <Status value={value} id={row.original.projectStatus} />,
  },
  {
    Header: 'Address',
    accessor: 'streetAddress',
  },
  {
    Header: 'City',
    accessor: 'city',
  },
  {
    Header: 'Client Start Date',
    accessor: 'clientStartDate',
    Cell: ({ value }) => dateFormat(value),
    getCellExportValue(row) {
      return dateFormat(row.original.clientStartDate)
    },
  },
  {
    Header: 'Client Due Date',
    accessor: 'clientDueDate',
    Cell: ({ value }) => dateFormat(value),
    getCellExportValue(row) {
      return dateFormat(row.original.clientDueDate)
    },
  },
  {
    Header: 'Type',
    accessor: 'projectTypeLabel',
  },
  {
    Header: 'Project Coordinator',
    accessor: 'projectCoordinator',
  },
  {
    Header: 'Account Payable',
    accessor: 'accountPayable',
    Cell(cellInfo) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
    getCellExportValue(row) {
      return numeral(row.original.accountPayable).format('$0,0.00')
    },
  },
  {
    Header: 'Zip',
    accessor: 'zipCode',
  },
  {
    Header: 'Client',
    accessor: 'clientName',
  },
  {
    Header: 'SOW Final Amount',
    accessor: 'sowOriginalContractAmount',
    Cell(cellInfo) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
    getCellExportValue(row) {
      return numeral(row.original.sowOriginalContractAmount).format('$0,0.00')
    },
  },
  {
    Header: 'Project Cost',
    accessor: 'projectRelatedCost',
    Cell(cellInfo) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
    getCellExportValue(row) {
      return numeral(row.original.accountPayable).format('$0,0.00')
    },
  },
  {
    Header: 'Paid Date',
    accessor: 'woaPaidDate',
    Cell: ({ value }) => dateFormat(value),
    getCellExportValue(row) {
      return dateFormat(row.original.woaPaidDate)
    },
  },
  {
    Header: 'Invoice Number',
    accessor: 'invoiceNumber',
  },
  {
    Header: 'Invoice Date',
    accessor: 'woaInvoiceDate',
    Cell: ({ value }) => dateFormat(value),
    getCellExportValue(row) {
      return dateFormat(row.original.woaInvoiceDate)
    },
  },
  {
    Header: 'Account Receivable',
    accessor: 'accountRecievable',
    Cell(cellInfo) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
    getCellExportValue(row) {
      return numeral(row.original.accountRecievable).format('$0,0.00')
    },
  },
  {
    Header: 'Market',
    accessor: 'market',
  },
  {
    Header: 'State',
    accessor: 'state',
  },
  {
    Header: 'WOA Finish',
    accessor: 'woaCompletionDate',
    Cell: ({ value }) => dateFormat(value),
    getCellExportValue(row) {
      return dateFormat(row.original.woaCompletionDate)
    },
  },
  {
    Header: 'Region',
    accessor: 'region',
  },
  {
    Header: 'Partial Payment',
    accessor: 'partialPayment',
    Cell(cellInfo) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
    getCellExportValue(row) {
      return numeral(row.original.partialPayment).format('$0,0.00')
    },
  },
  {
    Header: 'Expected Payment',
    accessor: 'expectedPaymentDate',
    Cell: ({ value }) => dateFormat(value),
    getCellExportValue(row) {
      return dateFormat(row.original.expectedPaymentDate)
    },
  },
  {
    Header: 'Profit Margins',
    accessor: 'profitPercentage',
    Cell(cellInfo) {
      return numeral(cellInfo.value / 100).format('0,0.00%')
    },
    getCellExportValue(row) {
      return `${row.original.profitPercentage}%`
    },
  },
  {
    Header: 'Profits',
    accessor: 'profitTotal',
    Cell(cellInfo) {
      return numeral(cellInfo.value).format('$0,0.00')
    },
    getCellExportValue(row) {
      return numeral(row.original.profitTotal).format('$0,0.00')
    },
  },
  {
    Header: 'WO Number',
    accessor: 'woNumber',
  },
  {
    Header: 'PO Number',
    accessor: 'poNumber',
  },
]

const ProjectRow: React.FC<RowProps> = ({ row, style }) => {
  const idCell = row.cells.find(cell => cell.column.id === 'id')
  const projectId = idCell?.value

  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
        '& > td > a': {
          color: '#333',
        },
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map((cell, index) => {
        return (
          <Td {...cell.getCellProps()} key={`row_${index}`} p="0" bg="transparent">
            <Link to={`/project-details/${projectId}`}>
              <Flex alignItems="center" h="72px" pl="3">
                <Text
                  noOfLines={1}
                  title={cell.value}
                  padding="0 15px"
                  color="gray.600"
                  mb="20px"
                  mt="10px"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight="400"
                >
                  {cell.render('Cell')}
                </Text>
              </Flex>
            </Link>
          </Td>
        )
      })}
    </Tr>
  )
}

type ProjectProps = {
  selectedCard: string
  selectedDay: string
  projectColumns: Column[]
  resizeElementRef: any
  setTableInstance: (tableInstance: any) => void
}
export const ProjectsTable: React.FC<ProjectProps> = ({
  setTableInstance,
  projectColumns,
  resizeElementRef,
  selectedCard,
  selectedDay,
}) => {
  const { projects, isLoading } = useProjects()
  const [filterProjects, setFilterProjects] = useState(projects)

  const { data: days } = useWeekDayProjectsDue()

  useEffect(() => {
    // To get pastDue Ids
    const pastDueIds = projects?.filter(project => project?.pastDue)
    const idPastDue = pastDueIds?.map(project => project?.id)

    if (!selectedCard && !selectedDay) setFilterProjects(projects)
    setFilterProjects(
      projects?.filter(
        project =>
          !selectedCard ||
          project.projectStatus?.replace(/\s/g, '').toLowerCase() === selectedCard?.toLowerCase() ||
          (selectedCard === 'pastDue' && idPastDue?.includes(project?.id)),
      ),
    )

    // Due Project Weekly Filter
    const getDates = days?.filter(day => {
      if (selectedDay === 'All' || selectedDay === day.dayName) {
        return true
      }
      return false
    })

    const clientDate = getDates?.map(dates => {
      var date = dates?.dueDate
      return date.substr(0, 10)
    })

    if (selectedDay) {
      setFilterProjects(projects?.filter(project => clientDate.includes(project?.clientDueDate?.substr(0, 10))))
    }
  }, [selectedCard, selectedDay, projects])

  return (
    <Box overflowX={'auto'} overflowY="hidden" height="100%">
      <TableWrapper
        isLoading={isLoading}
        columns={projectColumns}
        data={filterProjects || []}
        TableRow={ProjectRow}
        name="my-table"
        setTableInstance={setTableInstance}
        tableHeight={'inherit'}
        enablePagination={true}
        sortBy={{ id: 'id', desc: true }}
        defaultFlexStyle={false}
      />
    </Box>
  )
}
