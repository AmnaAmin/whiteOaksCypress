import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { ClientFormValues } from 'types/client.type'
import { useSaveNewClientDetails, useUpdateClientDetails, clientDetailsDefaultValues, clientDefault } from 'api/clients'
import { useMarkets, useStates } from 'api/pc-projects'

type ClientDetailsTabsProps = {
  refetch?: () => void
  onClose: () => void
  clientModalType?: string
  clientDetails?: any
  updateClientId?: (number) => void
  states?: any
  markets?: any
  setCreatedClientId?: (val) => void
}

export const ClientDetailsTabs = React.forwardRef((props: ClientDetailsTabsProps, ref) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)
  const { clientDetails } = props
  const { mutate: editClientDetails } = useUpdateClientDetails()
  const { mutate: addNewClientDetails } = useSaveNewClientDetails()
  const { stateSelectOptions: statesOptions } = useStates()
  const { marketSelectOptions: marketOptions } = useMarkets()

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  const methods = useForm<ClientFormValues>()

  const { handleSubmit: handleSubmit2, control, reset } = methods

  useEffect(() => {
    if (clientDetails) {
      reset(clientDetailsDefaultValues({ clientDetails, marketOptions, statesOptions }))
    } else {
      reset(clientDefault())
    }
  }, [reset, clientDetails, statesOptions?.length, marketOptions?.length])

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
        markets: values.markets.filter(market => market && market.id).map(market => ({ id: market.id })),
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
    [addNewClientDetails],
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit2(onSubmit, err => console.log('err..', err))} id="clientDetails">
        <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
          <TabList>
            <Tab>{t('details')}</Tab>
            <Tab>{t('market')}</Tab>
            <Tab isDisabled={!clientDetails?.id}>{t('notes')}</Tab>
          </TabList>
          <TabPanels mt="20px">
            <TabPanel p="0px">
              <DetailsTab clientDetails={clientDetails} onClose={props.onClose} setNextTab={setNextTab} />
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
