import { Box, Button, Divider, Flex, HStack, Icon, Spacer, Td, Text, Tr } from '@chakra-ui/react'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import TableColumnSettings from 'components/table/table-column-settings'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiDownArrowCircle, BiExport } from 'react-icons/bi'
import { useParams } from 'react-router'
import { TableNames } from 'types/table-column.types'
import { dateFormat } from 'utils/date-time-utils'
import { downloadFile, downloadFileOnly } from 'utils/file-utils'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings'
import { useDocuments } from 'api/vendor-projects'

const vendorDocumentRow: React.FC<RowProps> = ({ row, style }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: 'gray.50',
      }}
      {...row.getRowProps({
        style,
      })}
      cursor="pointer"
      onClick={() => {
        // @ts-ignore
        window.open(row.original?.s3Url, '_blank')
      }}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} p="0">
            {/** @ts-ignore */}
            <Flex alignItems="center" h="60px">
              <Text
                title={cell.value}
                padding="0 15px"
                fontWeight={400}
                fontStyle="normal"
                mt="10px"
                mb="10px"
                fontSize="14px"
                color="#4A5568"
                isTruncated
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

const withPreviewCell = ({ value, row }) => {
  const s3Url = row.original?.s3Url
  return <Text onClick={() => downloadFile(s3Url)}>{value}</Text>
}

export const VendorDocumentsTable = React.forwardRef((_, ref) => {
  const [documentTableInstance, setInstance] = useState<any>(null)
  const setDocumentTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const { isProjectCoordinator, isFPM } = useUserRolesSelector()
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { documents = [] } = useDocuments({
    projectId,
  })

  const { columns: documentColumns } = useColumnWidthResize(
    [
      {
        id: 'fileType',
        Header: t('document') || '',
        accessor: 'fileType',
        Cell: withPreviewCell,
      },
      {
        id: 'documentType',
        Header: t('documentType') || '',
        accessor: 'documentTypelabel',
        Cell: withPreviewCell,
      },
      {
        id: 'fileObjectContentType',
        Header: t('fileType') || '',
        accessor: 'fileObjectContentType',
        Cell: withPreviewCell,
      },
      {
        id: 'vendorName',
        Header: t('vendorGL') || '',
        accessor: 'vendorName',
        Cell: withPreviewCell,
      },
      {
        Header: t('trade') || '',
        accessor: 'workOrderName',
        id: 'workOrderName',
        Cell: withPreviewCell,
      },
      {
        Header: t('createdBy') || '',
        accessor: 'createdBy',
        id: 'createdBy',
        Cell: withPreviewCell,
      },
      {
        Header: t('createdDate') || '',
        accessor: 'createdDate',
        id: 'createdDate',
        Cell({ value, row }) {
          // @ts-ignore
          return (
            <Flex>
              <Box mr={2}>{dateFormat(value)}</Box>
              <Spacer w="90px" />
              <Icon
                as={BiDownArrowCircle}
                color="#4E87F8"
                fontSize={24}
                onClick={() => {
                  downloadFileOnly(row.original)
                }}
              />
            </Flex>
          )
        },
      },
    ],
    ref,
  )
  const { mutate: postDocumentColumn } = useTableColumnSettingsUpdateMutation(TableNames.document)
  const { tableColumns, settingColumns, isLoading } = useTableColumnSettings(documentColumns, TableNames.document)

  const onSave = columns => {
    postDocumentColumn(columns)
  }
  return (
    <Box>
      <TableWrapper
        disableFilter={true}
        columns={tableColumns}
        data={documents}
        TableRow={vendorDocumentRow}
        tableHeight="calc(100vh - 300px)"
        name="vendor-document-table"
        setTableInstance={setDocumentTableInstance}
      />
      {isProjectCoordinator ||
        (isFPM ? (
          <Flex justifyContent="end">
            <HStack bg="white" border="1px solid #E2E8F0" rounded="0 0 6px 6px" spacing={0}>
              <Button
                m={0}
                colorScheme="brand"
                variant="ghost"
                onClick={() => {
                  if (documentTableInstance) {
                    documentTableInstance?.exportData('mm/dd/yy', false)
                  }
                }}
              >
                <Icon as={BiExport} fontSize="18px" mr={1} />
                {t('export')}
              </Button>
              <Divider orientation="vertical" border="1px solid" h="20px" />
              {settingColumns && <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />}
            </HStack>
          </Flex>
        ) : null)}
    </Box>
  )
})
