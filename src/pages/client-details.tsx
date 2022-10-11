import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DetailsTab from 'features/clients/client-details-tab'
import { Market } from 'features/clients/client-market-tab'
import ClientNotes from 'features/clients/clients-notes-tab'
import { FormProvider, useForm } from 'react-hook-form'
import { ClientFormValues, Contact } from 'types/client.type'
import { accPayInfoDefaultFormValues, contactsDefaultFormValues, useUpdateClientDetails } from 'api/clients'
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
  const contactValues = contactsDefaultFormValues(props?.clientDetails)
  const accPayInfoValues = accPayInfoDefaultFormValues(props?.clientDetails)

  // Setting Dropdown values
  const stateSelect = states?.map(state => ({ value: state?.id, label: state?.name })) || []
  const stateValue = stateSelect?.find(b => b?.value === props?.clientDetails?.state)

  const paymentTermsValue = PAYMENT_TERMS_OPTIONS?.find(s => s?.value === props?.clientDetails?.paymentTerm)

  // const Contacts: Contact[] = []
  // props?.clientDetails?.contacts &&
  //   props?.clientDetails?.contacts.forEach(c => {
  //     const contactsObject = {
  //       id: c.id,
  //       contact: c.contact,
  //       phoneNumber: c.phoneNumber,
  //       emailAddress: c.emailAddress,
  //       market: c.market,
  //       phoneNumberExtension: '',
  //       createdBy: '',
  //       createdDate: '',
  //       modifiedBy: '',
  //       modifiedDate: '',
  //     }
  //     Contacts.push(contactsObject)
  //   })

  // const AccPayInfos: Contact[] = []
  // props?.clientDetails?.accountPayableContactInfos &&
  //   props?.clientDetails?.accountPayableContactInfos.forEach(a => {
  //     const accPayInfoObject = {
  //       id: a.id,
  //       contact: a.contact,
  //       phoneNumber: a.phoneNumber,
  //       emailAddress: a.emailAddress,
  //       comments: a.comments,
  //       market: a.market?.value,
  //       phoneNumberExtension: '',
  //       createdBy: '',
  //       createdDate: '',
  //       modifiedBy: '',
  //       modifiedDate: '',
  //     }
  //     AccPayInfos.push(accPayInfoObject)
  //   })

  const methods = useForm<ClientFormValues>({
    defaultValues: {
      companyName: props?.clientDetails?.companyName,
      paymentTerm: paymentTermsValue,
      paymentMethod: '',
      streetAddress: props?.clientDetails?.streetAddress,
      city: props?.clientDetails?.city,
      state: stateValue,
      zipCode: props?.clientDetails?.zipCode,
      contacts: props?.clientDetails ? contactValues : [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }],
      accountPayablePhoneNumber: props?.clientDetails?.accountPayablePhoneNumber,
      accountPayableContact: props?.clientDetails?.accountPayableContact,
      accountPayableContactInfos: props?.clientDetails
        ? accPayInfoValues
        : [{ contact: '', phoneNumber: '', city: '', comments: '' }],
    },
  })

  const { handleSubmit, control } = methods

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess() {},
      }

      const newContact: Contact[] = []
      values?.contacts &&
        values?.contacts.forEach(c => {
          const newContactObject = {
            id: '',
            contact: c.contact,
            phoneNumber: c.phoneNumber,
            emailAddress: c.emailAddress,
            market: c.market?.value,
            ...values?.contacts,
          }
          newContact.push(newContactObject)
        })

      const newAccPayInfo: Contact[] = []
      values?.contacts &&
        values?.contacts.forEach(a => {
          const newAccPayInfoObject = {
            id: '',
            contact: a.contact,
            phoneNumber: a.phoneNumber,
            comments: a.comments,
            ...values?.contacts,
          }
          newAccPayInfo.push(newAccPayInfoObject)
        })

      const newClientPayload = {
        companyName: values.companyName,
        paymentTerm: values.paymentTerm?.value,
        paymentAch: values.paymentAch,
        paymentCheck: values.paymentCheck,
        paymentCreditCard: values.paymentCreditCard,
        streetAddress: values.streetAddress,
        city: values.city,
        state: `${values.state?.value}`,
        zipCode: values.zipCode,
        contacts: newContact,
        accountPayableContactInfos: newAccPayInfo,
      }
      console.log('newClientPayload', newClientPayload)

      updateNewClientDetails(newClientPayload, queryOptions)
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
