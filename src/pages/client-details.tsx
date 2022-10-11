import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { ClientFormValues, Contact } from 'types/client.type'
import { useUpdateClientDetails } from 'api/clients'
import { useStates } from 'api/pc-projects'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { DevTool } from '@hookform/devtools'

type ClientDetailsTabsProps = {
  refetch?: () => void
  onClose: () => void
  clientModalType?: string
  clientDetails?: any
  updateClientId?: (number) => void
}

export const ClientDetailsTabs = React.forwardRef((props: ClientDetailsTabsProps, ref) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const clientDetails = props?.clientDetails
  const { mutate: updateNewClientDetails } = useUpdateClientDetails()
  const { states } = useStates()

  // Setting Dropdown values
  const stateSelect = states?.map(state => ({ value: state?.id, label: state?.name })) || []
  const stateValue = stateSelect?.find(b => b?.value === props?.clientDetails?.state)

  const paymentTermsValue = PAYMENT_TERMS_OPTIONS?.find(s => s?.value === props?.clientDetails?.paymentTerm)

  const methods = useForm<ClientFormValues>({
    defaultValues: {
      ...clientDetails,
      paymentTerm: paymentTermsValue,
      paymentMethod: '',
      state: stateValue,
      contacts: clientDetails?.contacts?.length
        ? clientDetails?.contacts
        : [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }],
      accountPayableContactInfos: clientDetails?.accountPayableContactInfos?.length
        ? clientDetails?.accountPayableContactInfos
        : [{ contact: '', phoneNumber: '', city: '', comments: '' }],
    },
  })

  const { handleSubmit, control } = methods

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess() {},
      }
      if (values?.id) {
        ///new Client Api
      } else {
        const newClientPayload = {
          ...values,
          paymentTerm: values.paymentTerm?.value,
          state: `${values.state?.value}`,
          contacts: values.contacts?.map(c => ({
            ...c,
            market: c.market?.value,
          })),
        }

        updateNewClientDetails(newClientPayload, queryOptions)
      }
    },
    [updateNewClientDetails],
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} id="newClientForm">
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
              <Market clientDetails={clientDetails} onClose={props.onClose} />
            </TabPanel>
            <TabPanel p="0px">
              <ClientNotes clientDetails={clientDetails} onClose={props.onClose} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </form>
      <DevTool control={control} />
    </FormProvider>
  )
})
