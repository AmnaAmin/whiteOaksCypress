import React, { useMemo } from 'react'
import { BiDownArrowCircle, BiTrash } from 'react-icons/bi'
import { Text, Flex, Box, Icon, Spacer, IconButton } from '@chakra-ui/react'
import { downloadFileOnly } from 'utils/file-utils'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { DownArrow, RightArrow } from 'components/expension-grid-arrows'

export const DOCUMENT_TYPES = {
  ORIGINAL_SOW: 39,
  INVOICE: 42,
}

const withPreviewCell = cellInfo => {
  const s3Url = cellInfo.row.original?.s3Url
  const value = cellInfo.getValue()

  return <Text onClick={() => window.open(s3Url, '_blank')}>{value}</Text>
}

export const useGetDocumentsTableColumn = (onResetConfirmationModalOpen: () => void, getDocId: (id) => void) => {
  let columns = useMemo(() => {
    return [
      {
        header: '',
        id: 'expander',
        size: 40,
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
        id: 'id',
        header: 'documentId',
        accessorKey: 'id',
        accessorFn: cellInfo => {
          return cellInfo?.id ? cellInfo.id?.toString() : '- - -'
        },
        cell: withPreviewCell,
      },

      {
        id: 'WorkOrderId',
        header: 'WorkOrder ID',
        accessorKey: 'workOrderId',
        accessorFn: cellInfo => {
          return cellInfo?.workOrderId ? cellInfo.workOrderId?.toString() : '- - -'
        },
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
        id: 'invoiceName',
        header: 'fileName',
        accessorKey: 'invoiceName',
        cell: withPreviewCell,
        filterFn: 'includesString',
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

      {
        header: '',
        id: 'deleteBtn',
        accessorKey: '',

        cell(cellInfo) {
          return (
            <>
              {cellInfo?.row?.original?.label !== 'Project SOW' && (
                <Flex
                  ml="-11px"
                  onClick={() => {
                    onResetConfirmationModalOpen()
                    getDocId(cellInfo?.row?.original)
                  }}
                >
                  <IconButton
                    aria-label="open-signature"
                    variant="ghost"
                    minW="auto"
                    height="auto"
                    _hover={{ color: '#345EA6' }}
                    data-testid="openSignature"
                  >
                    <BiTrash fontSize={24} color="gray.300" />
                  </IconButton>
                </Flex>
              )}
            </>
          )
        },
        accessorFn: () => {
          return (
            <div style={{ marginTop: '1px' }}>
              {/* {cellInfo.parentWorkOrderId ? cellInfo.parentWorkOrderId?.toString() : '- - -'} */}
            </div>
          )
        },
        size: 20,
      },
    ]
  }, [onResetConfirmationModalOpen])
  return columns
}
