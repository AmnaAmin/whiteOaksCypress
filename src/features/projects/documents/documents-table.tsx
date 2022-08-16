import { Box, Divider, Flex, HStack, Icon, Spacer, Td, Text, Tr } from '@chakra-ui/react'
import { Button } from 'components/button/button'
import { RowProps } from 'components/table/react-table'
import { TableWrapper } from 'components/table/table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiDownArrowCircle, BiExport } from 'react-icons/bi'
import { FaAtom } from 'react-icons/fa'
import { useParams } from 'react-router'
import { dateFormat } from 'utils/date-time-utils'
import { useColumnWidthResize } from 'utils/hooks/useColumnsWidthResize'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useDocuments, useFetchDocument } from 'utils/vendor-projects'

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
  const [documentUrl, setDocumentUrl] = useState<any>(null)
  const { data: binaryFile, refetch } = useFetchDocument(documentUrl)

  const download = s3Url => {
    setDocumentUrl(s3Url)
    refetch()
  }

  useEffect(() => {
    console.log(binaryFile)
  }, [binaryFile])
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
              <Icon
                as={BiDownArrowCircle}
                color="#4E87F8"
                fontSize={24}
                onClick={() => {
                  download(s3Url)
                }}
              />
            </Flex>
          )
        },
      },
    ],
    ref,
  )

  return (
    <Box>
      <TableWrapper
        disableFilter={true}
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
