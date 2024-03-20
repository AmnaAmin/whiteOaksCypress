import { TableContextProvider } from 'components/table-refactored/table-context'
import Table from 'components/table-refactored/table'
import { useTableColumnSettings } from 'api/table-column-settings-refactored'
import { TableNames } from 'types/table-column.types'
import { Box, useDisclosure } from '@chakra-ui/react'
import { PAYMENT_COLUMNS } from './constants'
import { useFetchPaymentMethods } from 'api/payment'
import { StripeCreditCardModalForm } from 'features/vendors/vendor-accounts'
import { VendorProfile, StripePayment } from 'types/vendor.types'
import { useState } from 'react'


type UserPaymnetAccountsTableProps = {
  vendorProfile: VendorProfile
}

const UserPaymentAccountsTable = (props: UserPaymnetAccountsTableProps) => {
  const [selectedRow, setSelectedRow] = useState<StripePayment | null>(null);
  const { vendorProfile } = props;

  const { data: paymentMethods, isLoading } = useFetchPaymentMethods(vendorProfile?.id);
  const { isOpen: isCCModalOpen, onOpen: onCCModalOpen, onClose: onCCModalClose } = useDisclosure();

  const onModalClose = () => {
    onCCModalClose();
    setSelectedRow(null);
  }

  const {
    tableColumns
  } = useTableColumnSettings(PAYMENT_COLUMNS, TableNames.vendorPaymentAccountTable)

  const renderCCEditModal = !isLoading && paymentMethods?.stripeResponse?.data?.length && selectedRow?.card;

  return (
    <Box h="calc(100% - 50px)" overflowX={"auto"}>
      {renderCCEditModal && <StripeCreditCardModalForm isCCModalOpen={isCCModalOpen} onCCModalClose={onModalClose} vendorProfileData={vendorProfile} creditCardData={selectedRow} />}
      <TableContextProvider
        data={paymentMethods?.stripeResponse?.data}
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
            onCCModalOpen()
          }}
          isLoading={isLoading}
          isEmpty={!isLoading && !paymentMethods?.stripeResponse?.data?.length}
        />
      </TableContextProvider>
    </Box>
  )
}

export default UserPaymentAccountsTable;
