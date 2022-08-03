import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import DetailsTab from 'features/projects/modals/project-coordinator/client-details-tab'
import { Market } from 'features/projects/modals/project-coordinator/client-market-tab'
import ClientNotes from 'features/projects/modals/project-coordinator/clients-notes-tab'

type ClientDetailsTabsProps = {
  refetch?: () => void
  onClose: () => void
  clientModalType?: string
  clientDetails?: any
}

export const ClientDetailsTabs = React.forwardRef((props: ClientDetailsTabsProps, ref) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const clientDetails = props?.clientDetails
 
  return (
    <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
      <TabList>
        <Tab>{t('details')}</Tab>
        <Tab>{t('market')}</Tab>
        <Tab>{t('notes')}</Tab>
      </TabList>

      <TabPanels mt="20px">
        <TabPanel p="0px">
          <DetailsTab clientDetails={clientDetails} onClose={props.onClose} />
        </TabPanel>
        <TabPanel p="0px">
          <Market clientDetails={clientDetails} onClose={props.onClose}/>
        </TabPanel>
        <TabPanel p="0px">
          <ClientNotes clientDetails={clientDetails} onClose={props.onClose}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
})
