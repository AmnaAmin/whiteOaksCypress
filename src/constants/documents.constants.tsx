import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { BiDownArrowCircle } from 'react-icons/bi'
import { Text, Flex, Box, Icon, Spacer } from '@chakra-ui/react'
import { downloadFileOnly } from 'utils/file-utils'
import { dateFormat } from 'utils/date-time-utils'

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
  },

  {
    id: 'workOrderName',
    header: 'trade',
    accessorKey: 'workOrderName',
    cell: withPreviewCell,
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
    cell(cellInfo) {
      return (
        <Flex>
          <Box mr={2}>{dateFormat(cellInfo.getValue() as string)}</Box>
          <Spacer w="90px" />
          <Icon
            as={BiDownArrowCircle}
            color="#4E87F8"
            fontSize={24}
            onClick={() => {
              downloadFileOnly(cellInfo.row.original)
            }}
          />
        </Flex>
      )
    },
  },
]
