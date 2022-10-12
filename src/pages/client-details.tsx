import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { ClientFormValues } from 'types/client.type'
import { useUpdateClientDetails } from 'api/clients'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { DevTool } from '@hookform/devtools'
import { useMarkets, useStates } from 'api/pc-projects'

type ClientDetailsTabsProps = {
  refetch?: () => void
  onClose: () => void
  clientModalType?: string
  clientDetails?: any
  updateClientId?: (number) => void
  states?: any
}

export const ClientDetailsTabs = React.forwardRef((props: ClientDetailsTabsProps, ref) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const clientDetails = props?.clientDetails
  // const { mutate: updateNewClientDetails } = useUpdateClientDetails()
  // const { markets } = useMarkets()
  const { states } = useStates()

  // // Setting Dropdown values
  // const stateSelect = props?.states?.map(state => ({ value: state?.id, label: state?.name })) || []
  // const stateValue = stateSelect?.find(b => b?.value === props?.clientDetails?.state)

  // const paymentTermsValue = PAYMENT_TERMS_OPTIONS?.find(s => s?.value === props?.clientDetails?.paymentTerm)

  // // Setting Default Values
  // const methods = useForm<ClientFormValues>({
  //   defaultValues: {
  //     ...clientDetails,
  //     paymentTerm: paymentTermsValue,
  //     paymentMethod: '',
  //     state: stateValue,
  //     contacts: clientDetails?.contacts?.length
  //       ? clientDetails?.contacts
  //       : [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }],
  //     accountPayableContactInfos: clientDetails?.accountPayableContactInfos?.length
  //       ? clientDetails?.accountPayableContactInfos
  //       : [{ contact: '', phoneNumber: '', emailAddress: '', comments: '' }],
  //   },
  // })

  // const { handleSubmit, control } = methods

  // const onSubmit = useCallback(
  //   async values => {
  //     const queryOptions = {
  //       onSuccess() {},
  //     }
  //     if (values?.id) {
  //       console.log('values...', values)
  //       const newClientPayload = {
  //         ...values,
  //         paymentTerm: values.paymentTerm?.value,
  //         state: values.state?.id,
  //         contacts: values.contacts?.map(c => ({
  //           ...c,
  //           market: c.market?.value,
  //         })),
  //       }

  //       updateNewClientDetails(newClientPayload, queryOptions)
  //     } else {
  //       ///new Client Api
  //     }
  //   },
  //   [updateNewClientDetails],
  // )

  return (
    // <FormProvider {...methods}>
    //   <form onSubmit={handleSubmit(onSubmit, err => console.log('err..', err))} id="newClientForm">
        <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab>{t('details')}</Tab>
            <Tab>{t('market')}</Tab>
            <Tab>{t('notes')}</Tab>
          </TabList>
          <TabPanels mt="20px">
            <TabPanel p="0px">
              <DetailsTab clientDetails={clientDetails} states={props?.states} onClose={props.onClose} />
            </TabPanel>
            <TabPanel p="0px">
              <Market clientDetails={clientDetails} onClose={props.onClose} />
            </TabPanel>
            <TabPanel p="0px">
              <ClientNotes clientDetails={clientDetails} onClose={props.onClose} />
            </TabPanel>
          </TabPanels>
        </Tabs>
    //   </form>
    //   <DevTool control={control} />
    // </FormProvider>
  )
})
