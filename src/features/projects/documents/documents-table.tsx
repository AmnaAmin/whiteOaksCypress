import React from 'react'
import { Box, Td, Tr, Text, Flex } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useDocuments } from 'utils/vendor-projects'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
import { downloadFile } from 'utils/file-utils'
import { Document } from '../../../types/vendor.types'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'

const vendorDocumentRow: React.FC<RowProps> = ({ row, style }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: '#eee',
      }}
      cursor="pointer"
      {...row.getRowProps({
        style,
      })}
      onClick={() => {
        // @ts-ignore
        const s3Url = row.original?.s3Url
        if (s3Url) {
          downloadFile(s3Url)
        }
      }}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text
                noOfLines={2}
                title={cell.value}
                padding="0 15px"
                fontWeight={400}
                fontStyle="normal"
                mt="10px"
                mb="10px"
                fontSize="14px"
                color="#4A5568"
              >
                {cell.render('Cell')}
              </Text>
            </Flex>
          </Td>
        )
      })}
    </Tr>
  )
}

export const VendorDocumentsTable = React.forwardRef((props: { latestUploadedDoc: Document }, ref) => {
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { documents = [] } = useDocuments({
    projectId,
    latestUploadedDoc: props.latestUploadedDoc,
  })

  const { columns } = useColumnWidthResize(
    [
      {
        id: 'fileType',
        Header: t('document') || '',
        accessor: 'fileType',
      },
      {
        id: 'documentType',
        Header: t('documentType') || '',
        accessor: 'documentTypelabel',
      },
      {
        id: 'fileObjectContentType',
        Header: t('fileType') || '',
        accessor: 'fileObjectContentType',
      },
      {
        id: 'vendorName',
        Header: t('vendorGL') || '',
        accessor: 'vendorName',
      },
      {
        Header: t('workOrder') || '',
        accessor: 'workOrderName',
        id: 'workOrderName',
      },
      {
        Header: t('createdBy') || '',
        accessor: 'createdBy',
        id: 'createdBy',
      },
      {
        Header: t('createdDate') || '',
        accessor: 'createdDate',
        id: 'createdDate',
        Cell({ value }) {
          return <Box>{dateFormat(value)}</Box>
        },
      },
    ],
    ref,
  )

  return (
    <Box>
      <ReactTable
        columns={columns}
        data={documents}
        TableRow={vendorDocumentRow}
        tableHeight="calc(100vh - 300px)"
        name="vendor-document-table"
      />
    </Box>
  )
})
