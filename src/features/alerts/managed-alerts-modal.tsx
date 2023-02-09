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
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AlertFormValues } from 'types/alert.type'
import { alertDetailsDefaultValues, useSaveAlertDetails, useUpdateAlertDetails } from 'api/alerts'

type ManagedAlertsTypes = {
  isOpen: boolean
  onClose: () => void
  selectedAlert: any
}

export const ManagedAlertsModal: React.FC<ManagedAlertsTypes> = ({ isOpen, onClose, selectedAlert }) => {
  const { t } = useTranslation()
  const { mutate: editAlertsDetails } = useUpdateAlertDetails()
  const { mutate: saveAlertsDetails } = useSaveAlertDetails()

  const [tabIndex, setTabIndex] = useState(0)

  const methods = useForm<AlertFormValues>()

  const { handleSubmit, control, reset } = methods

  useEffect(() => {
    if (selectedAlert) {
      reset(alertDetailsDefaultValues({ selectedAlert }))
    }
  }, [reset, selectedAlert])

  const setNextTab = () => {
    setTabIndex(tabIndex + 1)
  }

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess() {},
      }
      const alertsPayload = {
        ...values,
        category: values?.category?.label,
        notify: values?.notify?.value,
        typeSelection: values?.typeSelection?.label,
        attributeSelection: values?.attributeSelection?.label,
        behaviourSelection: values?.behaviourSelection?.label,
        customAttributeSelection:
          values?.behaviourSelection?.label === 'Equal To'
            ? values?.customAttributeSelection?.value
            : values?.customAttributeSelection,
      }
      if (values?.id) {
        editAlertsDetails(alertsPayload, queryOptions)
      } else {
        saveAlertsDetails(alertsPayload, {
          onSuccess() {
            onClose()
          },
        })
      }
    },
    [saveAlertsDetails],
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
                    {selectedAlert ? t('editAlert') : t('newAlert')}
                  </FormLabel>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Tabs variant="enclosed" colorScheme="brand" index={tabIndex} onChange={index => setTabIndex(index)}>
                    <TabList>
                      <Tab>{t('details')}</Tab>
                      <Tab>{t('notify')}</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <AlertsDetailsTab setNextTab={setNextTab} />
                      </TabPanel>
                      <TabPanel p={0}>
                        <AlertsNotifyTab onClose={onClose} />
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
