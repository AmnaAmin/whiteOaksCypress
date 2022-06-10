import React from 'react'
import { Box, Td, Tr, Text, Flex, Icon, Divider, Center } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useDocuments } from 'utils/vendor-projects'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
import { downloadFile } from 'utils/file-utils'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import { BiDownArrowCircle, BiExport } from 'react-icons/bi'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { Button } from 'components/button/button'
import { FaAtom } from 'react-icons/fa'

const vendorDocumentRow: React.FC<RowProps> = ({ row, style }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: 'gray.50',
      }}
      cursor="pointer"
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map(cell => {
        return (
          <Td
            {...cell.getCellProps()}
            key={`row_${cell.value}`}
            p="0"
            onClick={() => {
              // @ts-ignore
              const s3Url = row.original?.s3Url
              if (s3Url) {
                window.open(s3Url, '_blank')
              }
            }}
          >
            {/** @ts-ignore */}
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

      <Center>
        <Icon
          pos="absolute"
          right="10px"
          as={BiDownArrowCircle}
          color="#4E87F8"
          fontSize={24}
          onClick={() => {
            // @ts-ignore
            const s3Url = row.original?.s3Url
            if (s3Url) {
              downloadFile(s3Url)
            }
          }}
        />
      </Center>
    </Tr>
  )
}

export const VendorDocumentsTable = React.forwardRef((_, ref) => {
  const { isProjectCoordinator } = useUserRolesSelector()
  const { t } = useTranslation()
  const { projectId } = useParams<'projectId'>()
  const { documents = [] } = useDocuments({
    projectId,
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
        Header: t('trade') || '',
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
          return <Box mr={2}>{dateFormat(value)}</Box>
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
      {isProjectCoordinator && (
        <Flex justifyContent="end">
          <Button variant="ghost" colorScheme="brand">
            <Icon as={BiExport} fontSize="18px" mr={1} />
            Export
          </Button>
          <Divider orientation="vertical" border="2px solid" h="35px" />
          <Button variant="ghost" colorScheme="brand" m={0}>
            <Icon as={FaAtom} fontSize="18px" mr={1} />
            Export
          </Button>
        </Flex>
      )}
    </Box>
  )
})
