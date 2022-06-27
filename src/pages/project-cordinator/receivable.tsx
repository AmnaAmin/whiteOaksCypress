import { AccountDetails } from 'features/account-details/account-details'
import React from 'react'

export const Receivable: React.FC = () => {
  return (
    <AccountDetails
      topTitle={'Account Receivable'}
      ID={'receivable'}
      payloadType={'Remaining Payments'}
      typeCode={'AR'}
    />
  )
}
