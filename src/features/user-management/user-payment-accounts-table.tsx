import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { Box, useDisclosure, Flex, Button, Icon } from '@chakra-ui/react'
import { PAYMENT_COLUMNS } from './constants'
import { isPaymentServiceEnabled, useFetchPaymentMethods } from 'api/payment'
import { StripeCreditCardModalForm } from 'features/vendors/vendor-accounts'
import { VendorProfile, StripePayment } from 'types/vendor.types'
import { useState } from 'react'
import VendorACHUpdateModal from 'features/vendors/vendor-payments/vendor-ach-modal'
import { AccountType } from 'features/vendors/vendor-payments/vendor-financial-account-type'
import { BiBookAdd } from 'react-icons/bi'

type UserPaymnetAccountsTableProps = {
  vendorProfile: VendorProfile
  isActive: any
  isVendorAccountSaveLoading?: boolean
  achPaymentMethod: StripePayment | undefined
  onNewBtnClick: () => void
}

const UserPaymentAccountsTable = (props: UserPaymnetAccountsTableProps) => {
  const [selectedRow, setSelectedRow] = useState<StripePayment | null>(null);
  const { vendorProfile, isActive, isVendorAccountSaveLoading, achPaymentMethod, onNewBtnClick } = props;

  const { data: paymentMethods, isLoading } = useFetchPaymentMethods(vendorProfile?.id);
  const { isOpen: isCCModalOpen, onOpen: onCCModalOpen, onClose: onCCModalClose } = useDisclosure();
  const { isOpen: isACHModalOpen, onOpen: onACHModalOpen, onClose: onACHModalClose } = useDisclosure();
  const {
    tableColumns
  } = useTableColumnSettings(PAYMENT_COLUMNS, TableNames.vendorPaymentAccountTable)

  const onModalClose = () => {
    onCCModalClose();
    setSelectedRow(null);
  }

  let tableData: StripePayment[] | [] = paymentMethods?.stripeResponse?.data && Array.isArray(paymentMethods?.stripeResponse?.data) ? paymentMethods?.stripeResponse?.data : [];
  if (achPaymentMethod) tableData = [...tableData, achPaymentMethod as StripePayment]

  const renderCCEditModal = !isLoading && paymentMethods?.stripeResponse?.data?.length && selectedRow?.card;
  const renderACHModal = !isLoading && Boolean(achPaymentMethod);

  const hideNewBtn = achPaymentMethod?.type || isPaymentServiceEnabled;

  return (
    <>
      {!hideNewBtn && <Flex w='full' alignItems={"end"} justifyContent={"end"} pb={4}>
        <Button disabled={isLoading} data-testid="add-new-payment-method" colorScheme="brand" leftIcon={<Icon boxSize={4} as={BiBookAdd} />} onClick={onNewBtnClick}>
          New
        </Button>
      </Flex>}
      <Box h={hideNewBtn ? "625px" : "570px"} overflowX={"auto"}>
        {renderCCEditModal && <StripeCreditCardModalForm isCCModalOpen={isCCModalOpen} onCCModalClose={onModalClose} vendorProfileData={vendorProfile} creditCardData={selectedRow} />}
        {renderACHModal && <VendorACHUpdateModal isOpen={isACHModalOpen} onClose={onACHModalClose} vendorProfileData={vendorProfile} isActive={isActive} isVendorAccountSaveLoading={isVendorAccountSaveLoading} />}
        <TableContextProvider
          data={tableData}
          columns={tableColumns}
        >
          <Table
            onRowClick={(row: StripePayment) => {
              if (row?.id === paymentMethods?.customer?.invoice_settings?.default_payment_method?.id) {
                row.isPaymentMethodDefault = true;
              } else {
                row.isPaymentMethodDefault = false;
              }
              setSelectedRow(row)
              if (row?.card) onCCModalOpen()
              if (row?.type === AccountType.ACH_BANK) onACHModalOpen();
            }}
            isLoading={isLoading}
            isEmpty={!isLoading && !tableData?.length}
          />
        </TableContextProvider>
      </Box>
    </>
  )
}

export default UserPaymentAccountsTable;
