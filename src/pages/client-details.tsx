import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { DevTool } from '@hookform/devtools'
import { ClientFormValues } from 'types/client.type'
import { useSaveNewClientDetails, useUpdateClientDetails } from 'api/clients'
import { client } from 'utils/api-client'

type ClientDetailsTabsProps = {
  refetch?: () => void
  onClose: () => void
  clientModalType?: string
  clientDetails?: any
  updateClientId?: (number) => void
  states?: any
  marketOptions?: any
  setCreatedClientId?: (val) => void
}

export const ClientDetailsTabs = React.forwardRef((props: ClientDetailsTabsProps, ref) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const clientDetails = props?.clientDetails
  const marketSelectOptions = props?.marketOptions
  const { mutate: editClientDetails } = useUpdateClientDetails()
  const { mutate: addNewClientDetails } = useSaveNewClientDetails()

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  // Setting Dropdown values
  const stateSelect = props?.states?.map(state => ({ value: state?.id, label: state?.name })) || []
  const stateValue = stateSelect?.find(b => b?.value === props?.clientDetails?.state)
  const paymentTermsValue = PAYMENT_TERMS_OPTIONS?.find(s => s?.value === props?.clientDetails?.paymentTerm)

  // Setting Default Values
  const methods = useForm<ClientFormValues>()

  const { handleSubmit: handleSubmit2, control, reset } = methods

  useEffect(() => {
    reset({
      ...clientDetails,
      paymentTerm: paymentTermsValue || { label: '20', value: '20' },
      state: stateValue,
      contacts:
        clientDetails?.contacts?.length > 0
          ? [
              ...clientDetails?.contacts?.map(c => {
                const selectedMarket = marketSelectOptions?.find(m => m.id === c.market.id)
                return {
                  contact: c.contact,
                  phoneNumber: c.phoneNumber,
                  emailAddress: c.emailAddress,
                  market: selectedMarket,
                }
              }),
            ]
          : [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }],

      accountPayableContactInfos: clientDetails?.accountPayableContactInfos?.length
        ? clientDetails?.accountPayableContactInfos
        : [{ contact: '', phoneNumber: '', emailAddress: '', comments: '' }],
    })
  }, [clientDetails])

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess(response) {
          props?.setCreatedClientId?.(response.data?.id)
        },
      }
      const clientPayload = {
        ...values,
        paymentTerm: values.paymentTerm?.value,
        state: values.state?.id,
        contacts: values.contacts?.map(c => ({
          ...c,
          market: c.market?.value,
        })),
      }
      if (values?.id) {
        editClientDetails(clientPayload, queryOptions)
      } else {
        addNewClientDetails(clientPayload, queryOptions)
      }
    },
    [addNewClientDetails, client],
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit2(onSubmit, err => console.log('err..', err))} id="clientDetails">
        <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab>{t('details')}</Tab>
            <Tab>{t('market')}</Tab>
            <Tab
            //isDisabled={!clientDetails?.id}
            >
              {t('notes')}
            </Tab>
          </TabList>
          <TabPanels mt="20px">
            <TabPanel p="0px">
              <DetailsTab
                clientDetails={clientDetails}
                states={props?.states}
                onClose={props.onClose}
                setNextTab={setNextTab}
              />
            </TabPanel>
            <TabPanel p="0px">
              <Market clientDetails={clientDetails} onClose={props.onClose} setNextTab={setNextTab} />
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
