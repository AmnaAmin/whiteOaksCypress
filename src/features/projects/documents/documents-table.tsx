import React from 'react'
import { Box, Td, Tr, Text, Flex, Icon, Divider, Link, Spacer, HStack } from '@chakra-ui/react'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import ReactTable, { RowProps } from 'components/table/react-table'
import { useDocuments } from 'utils/vendor-projects'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
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
      onClick={e => {
        e.preventDefault()
        // @ts-ignore
        const s3Url = row.original?.s3Url
        // @ts-ignore
        if (s3Url) {
          window.open(s3Url, '_self')
        }
      }}
    >
      {row.cells.map(cell => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
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
        Cell({ value, row }) {
          // @ts-ignore
          const s3Url = row.original?.s3Url
          return (
            <Flex>
              <Box mr={2}>{dateFormat(value)}</Box>
              <Spacer w="90px" />
              <Link href={s3Url} onClick={e => e.stopPropagation()}>
                <Icon as={BiDownArrowCircle} color="#4E87F8" fontSize={24} />
              </Link>
            </Flex>
          )
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
          <HStack bg="white" border="1px solid #E2E8F0" rounded="0 0 6px 6px" spacing={0}>
            <Button variant="ghost" colorScheme="brand" m={0}>
              <Icon as={BiExport} fontSize="18px" mr={1} />
              {t('export')}
            </Button>
            <Divider orientation="vertical" border="1px solid" h="20px" />
            <Button variant="ghost" colorScheme="brand" m={0}>
              <Icon as={FaAtom} fontSize="18px" mr={1} />
              {t('settings')}
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  )
})
