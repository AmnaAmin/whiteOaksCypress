import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { useClients } from 'utils/clients'
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
  const { data: clientsData } = useClients()
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
          <DetailsTab />
        </TabPanel>
        <TabPanel p="0px">
          <Markets />
        </TabPanel>
        <TabPanel p="0px">
          <WorkOrderNotes />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
