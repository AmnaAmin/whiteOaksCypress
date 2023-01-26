import {
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { AlertsDetailsTab } from 'features/alerts/alerts-details-tab'
import { AlertsNotifyTab } from 'features/alerts/alerts-notify-tab'
import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AlertFormValues, AlertType } from 'types/alert.type'
import { alertDetailsDefaultValues } from 'api/alerts'

type ManagedAlertsTypes = {
  isOpen: boolean
  onClose: () => void
  selectedAlert: any
}

export const ManagedAlertsModal: React.FC<ManagedAlertsTypes> = ({ isOpen, onClose, selectedAlert }) => {
  const { t } = useTranslation()
  console.log('selectedAlert', selectedAlert)

  const methods = useForm<AlertFormValues>()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods
  
  useEffect(() => {
    if (selectedAlert) {
      reset(alertDetailsDefaultValues({ selectedAlert }))
    } 
  }, [reset, selectedAlert])

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess(response) {
          // props?.setCreatedClientId?.(response.data?.id)
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
      }
      if (values?.id) {
        // editClientDetails(clientPayload, queryOptions)
      } 
      // else {
      //   addNewClientDetails(clientPayload, {
      //     onSuccess() {
      //       onClose()
      //     },
      //   })
      // }
    },
    [], // addNewClientDetails
  )


  return (
    <>
      <div>
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalOverlay />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, err => console.log('err..', err))} id="alertDetails" noValidate>
              <ModalContent>
                <ModalHeader borderBottom="1px solid #eee">
                  <FormLabel variant="strong-label" size="lg">
                    {t('newAlert')}
                  </FormLabel>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Tabs variant="enclosed" colorScheme="brand">
                    <TabList>
                      <Tab>{t('details')}</Tab>
                      <Tab>{t('notify')}</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <AlertsDetailsTab selectedAlert={selectedAlert} isOpen={false} onClose={onClose} />
                      </TabPanel>
                      <TabPanel p={0}>
                        {/* <AlertsNotifyTab selectedAlert = {selectedAlert} onClose={onClose} /> */}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </ModalBody>
              </ModalContent>
            </form>
            <DevTool control={control} />
          </FormProvider>
        </Modal>
      </div>
    </>
  )
}
