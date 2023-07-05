import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { BiDownArrowCircle } from 'react-icons/bi'
import { Text, Flex, Box, Icon, Spacer } from '@chakra-ui/react'
import { downloadFileOnly } from 'utils/file-utils'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { DownArrow, RightArrow } from 'components/expension-grid-arrows'

export const DOCUMENT_TYPES = {
  ORIGINAL_SOW: 39,
}

const withPreviewCell = cellInfo => {
  const s3Url = cellInfo.row.original?.s3Url
  const value = cellInfo.getValue()

  return <Text onClick={() => window.open(s3Url, '_blank')}>{value}</Text>
}

export const DOCUMENTS_TABLE_COLUMNS: ColumnDef<any>[] = [
  {
    header: '',
    id: 'expander',
    size: 20,
    cell: ({ row, getValue }) => (
      <Flex
        onClick={e => e.stopPropagation()}
        style={{
          paddingLeft: `${row.depth * 1.5}rem`,
        }}
      >
        {row.getToggleExpandedHandler()}
        <>
          {row.getCanExpand() ? (
            <button
              data-testid="expension-&-compression-btn"
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? (
                <DownArrow
                  style={{
                    marginRight: '8px',
                  }}
                />
              ) : (
                <RightArrow
                  style={{
                    marginRight: '8px',
                  }}
                />
              )}
            </button>
          ) : (
            ''
          )}
          {getValue()}
        </>
      </Flex>
    ),
    accessorFn: cellInfo => {
      return (
        <div style={{ marginTop: '1px' }}>
          {/* {cellInfo.parentWorkOrderId ? cellInfo.parentWorkOrderId?.toString() : '- - -'} */}
        </div>
      )
    },
  },

  {
    id: 'workOrderId',
    header: 'workOrderId',
    accessorKey: 'workOrderId',
    cell: withPreviewCell,
  },
  {
    id: 'fileType',
    header: 'document',
    accessorKey: 'fileType',
    cell: withPreviewCell,
  },
  {
    id: 'documentType',
    header: 'documentType',
    accessorKey: 'documentTypelabel',
    cell: withPreviewCell,
  },
  {
    header: 'transactionDoc',
    accessorKey: 'label',
    id: 'label',
    cell: withPreviewCell,
  },
  {
    id: 'vendorName',
    header: 'vendorGL',
    accessorKey: 'vendorName',
    cell: withPreviewCell,
    filterFn: 'includesString',
  },

  {
    id: 'workOrderName',
    header: 'Skill',
    accessorKey: 'workOrderName',
    cell: withPreviewCell,
    filterFn: 'includesString',
  },
  {
    id: 'fileObjectContentType',
    header: 'fileType',
    accessorKey: 'fileObjectContentType',
    cell: withPreviewCell,
  },

  {
    header: 'createdBy',
    accessorKey: 'createdBy',
    id: 'createdBy',
    cell: withPreviewCell,
  },
  {
    header: 'createdDate',
    accessorKey: 'createdDate',
    id: 'createdDate',
    accessorFn(cellInfo) {
      return datePickerFormat(cellInfo.createdDate)
    },

    meta: { format: 'date' },
    cell(cellInfo) {
      return (
        <Flex position="relative">
          <Box mr={2}>{dateFormat(cellInfo.getValue() as string)}</Box>
          <Spacer w="90px" />
          <Box
            left="81%"
            top="-85%"
            w="39px"
            h="46px"
            position="absolute"
            onClick={() => {
              downloadFileOnly(cellInfo.row.original)
            }}
            _hover={{ cursor: 'pointer', backgroundColor: '#CFEDFD' }}
          >
            <Icon
              p="1px"
              as={BiDownArrowCircle}
              color="#345EA6"
              fontSize={24}
              position="relative"
              top="10px"
              // bottom="0"
              left="8px"
              // right="0"
              // m="auto"
            />
          </Box>
        </Flex>
      )
    },
  },
]
