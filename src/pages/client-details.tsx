import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Icon, Box } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { ClientFormValues } from 'types/client.type'
import {
  useSaveNewClientDetails,
  useUpdateClientDetails,
  clientDetailsDefaultValues,
  clientDefault,
  useSubFormErrors,
  useClientNoteMutation,
} from 'api/clients'
import { useMarkets, useStates } from 'api/pc-projects'
import { BiErrorCircle } from 'react-icons/bi'
import { Card } from 'components/card/card'
import { CLIENTS } from 'features/clients/clients.i18n'
import { CarrierTab } from 'features/clients/client-carrier-tab'
import { Messages } from 'features/messages/messages'

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
  const { clientDetails, onClose } = props
  const { mutate: editClientDetails } = useUpdateClientDetails()
  const { mutate: addNewClientDetails, isLoading } = useSaveNewClientDetails()
  const { stateSelectOptions: statesOptions } = useStates()
  const { marketSelectOptions: marketOptions, markets } = useMarkets()
  const [message, setMessage] = useState('')
  const { mutate: createNotes } = useClientNoteMutation(null)

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  const methods = useForm<ClientFormValues>()

  const {
    handleSubmit: handleSubmit2,
    control,
    reset,
    formState: { errors },
  } = methods

  const { isClientDetailsTabErrors, isCarrierTabErrors } = useSubFormErrors(errors)

  useEffect(() => {
    if (clientDetails) {
      reset(clientDetailsDefaultValues({ clientDetails, marketOptions, statesOptions, markets }))
    } else {
      reset(clientDefault({ markets }))
    }
  }, [reset, clientDetails, statesOptions?.length, marketOptions?.length, markets?.length])

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
        markets: values.markets.filter(market => market && market.checked).map(market => ({ id: market.id })),
        contacts: values.contacts?.map(c => ({
          ...c,
          market: c.market?.value,
        })),
        activated: values.activated?.value,
        carrier: values?.carrier?.map(c => {
          return {
            id: c.id,
            name: c.name,
            email: c.emailAddress,
            phone: c.phoneNumber,
          }
        }),
      }
      if (values?.id) {
        editClientDetails(clientPayload, queryOptions)
      } else {
        addNewClientDetails(clientPayload, {
          onSuccess(e) {
            const payload = {
              comment: message,
              clientId: e?.data?.id,
            }
            if (message) {
              createNotes(payload)
            }
            onClose()
          },
        })
      }
    },
    [addNewClientDetails, message],
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit2(onSubmit, err => console.log('err..', err))} id="clientDetails" noValidate>
        <Tabs size="md" variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
          <TabList borderBottom="none">
            <TabCustom isError={isClientDetailsTabErrors && tabIndex !== 0}>{t('details')}</TabCustom>
            <TabCustom isError={isCarrierTabErrors && tabIndex !== 1}>{t(`${CLIENTS}.carrier`)}</TabCustom>
            <TabCustom>{t('market')}</TabCustom>
            <TabCustom>{t('notes')}</TabCustom>
            {clientDetails && <Tab data-testid="client_messages">{t('messages')}</Tab>}
          </TabList>
          <Card borderTopLeftRadius="0px !important" borderTopRightRadius="6px" width="1165px">
            <TabPanels mt="20px">
              <TabPanel p="0px">
                <DetailsTab clientDetails={clientDetails} onClose={props.onClose} setNextTab={setNextTab} />
              </TabPanel>
              <TabPanel p="0px">
                <CarrierTab clientDetails={clientDetails} onClose={props.onClose} setNextTab={setNextTab}></CarrierTab>
              </TabPanel>
              <TabPanel p="0px">
                <Market
                  clientDetails={clientDetails}
                  onClose={props.onClose}
                  setNextTab={setNextTab}
                  saveLoading={isLoading}
                />
              </TabPanel>
              <TabPanel p="0px">
                <ClientNotes clientDetails={clientDetails} onClose={props.onClose} setMessage={setMessage} />
              </TabPanel>
              {clientDetails && (
                <TabPanel p="0px">
                  <Box w="100%" height={493}>
                    <Messages id={clientDetails?.id} entity="client" value={clientDetails} />
                  </Box>
                </TabPanel>
              )}
            </TabPanels>
          </Card>
        </Tabs>
      </form>
      <DevTool control={control} />
    </FormProvider>
  )
})

const TabCustom: React.FC<{ isError?: boolean }> = ({ isError, children }) => {
  return (
    <Tab>
      <>
        {isError ? (
          <Flex alignItems="center">
            <Icon as={BiErrorCircle} size="18px" color="red.400" mr="1" />
            <Box color="red.400">{children}</Box>
          </Flex>
        ) : (
          children
        )}
      </>
    </Tab>
  )
}

export default ClientDetailsTabs
