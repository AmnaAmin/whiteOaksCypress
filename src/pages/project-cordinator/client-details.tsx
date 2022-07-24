import { Details } from 'features/vendor-details/details'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useVendorProfile } from 'utils/vendor-details'
import { TradeList } from 'features/vendor-details/trades'
import { MarketList } from 'features/vendor-details/markets'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Box, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { License } from 'features/vendor-details/license'
import { DocumentsCard } from 'features/vendor-details/documents-card'
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { Account } from 'types/account.types'
import { VendorProfile } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import PcDetails from 'features/project-coordinator/vendor/details'
import { AuditLogs, AUDIT_LOGS_COLUMNS } from 'features/vendor-details/audit-logs'
import { useTableColumnSettings } from 'utils/table-column-settings'
import { TableNames } from 'types/table-column.types'
import { Card } from 'features/login-form-centered/Card'
import { useClients } from 'utils/clients'
import { useParams } from 'react-router-dom'
import DetailsTab from 'features/projects/modals/project-coordinator/client-details-tab'
import { Markets } from 'features/projects/modals/project-coordinator/client-market-tab'
import WorkOrderNotes from 'features/projects/modals/work-order-notes'

type Props = {
  // clientProfileData?: ClientProfile //VendorProfile
  onClose?: () => void
  refetch?: () => void
  clientModalType?: string
}

export const ClientDetailsTabs: React.FC<Props> = props => {
  const ClientType = props.clientModalType
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const { data : clientsData } = useClients()
  const clientProfileData = clientsData

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
    props.refetch?.()
  }

  return (
    <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
      <TabList>
        <Tab>{t('details')}</Tab>
        <Tab>{t('market')}</Tab>
        <Tab>{t('notes')}</Tab>
      </TabList>

      <TabPanels mt="31px">
        <TabPanel p="0px">
          <DetailsTab/>
        </TabPanel>
        <TabPanel p="0px">
          <Markets/>
        </TabPanel>
        <TabPanel p="0px">
          <WorkOrderNotes/>
          {/* <Notes/> */}
        </TabPanel>        
      </TabPanels>
    </Tabs>
  )
}
