import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, useToast } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { ClientFormValues } from 'types/client.type'
import { DevTool } from '@hookform/devtools'
import { useCreateClientMutation } from 'api/clients'

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
  const { mutate: saveNewClientDetails } = useCreateClientMutation()
  const toast = useToast()

  const methods = useForm<ClientFormValues>({
    defaultValues: {
      companyName: '',
      paymentTerm: '',
      paymentMethod: '',
      streetAddress: '',
      city: '',
      state: 0,
      zipCode: '',
      contacts: [],
      accountPayableContactInfos: [],
    },
  })

  const { handleSubmit } = methods
  const onSubmit = useCallback(
    async values => {
      const newContact = {
        contact: values.contact,
        emailAddress: values.emailAddress,
        phoneNumber: values.phoneNumber,
        market: values.market,
        comments: values.comments,
      }

      const newAccountPayableContactInfos = {
        contact: values.contact,
        emailAddress: values.emailAddress,
        phoneNumber: values.phoneNumber,
        market: values.market,
        comments: values.comments,
      }

      const newClientPayload = {
        // projectType: `${values.projectType?.value}`,
        companyName: values.companyName,
        paymentTerm: values.paymentTerm,
        paymentAch: values.paymentAch,
        paymentCheck: values.paymentCheck,
        paymentCreditCard: values.paymentCreditCard,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        contacts: newContact,
        accountPayableContactInfos: newAccountPayableContactInfos,
      }

      saveNewClientDetails(newClientPayload, {
        onSuccess(response) {
          toast({
            title: 'Client Details',
            description: `New client has been created successfully.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          // onClose()
        },
        onError(error: any) {
          toast({
            title: 'Client Details',
            description: (error.title as string) ?? 'Unable to save client.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        },
      })
    },
    [saveNewClientDetails],
  )

  return (
    <Flex>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} id="newClientForm">
          <Tabs
            size="md"
            variant="enclosed"
            colorScheme="brand"
            index={tabIndex}
            onChange={index => setTabIndex(index)}
          >
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
      </FormProvider>
    </Flex>
  )
})
