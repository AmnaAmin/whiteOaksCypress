import React, { useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormLabel,
  Box,
  HStack,
  Input,
  Divider,
  useToast,
  FormControl,
} from '@chakra-ui/react'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { dateFormat } from 'utils/date-time-utils'
import { convertDateTimeToServerISO } from 'components/table/util'
import { useQueryClient } from 'react-query'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { t } from 'i18next'
import Select from 'components/form/react-select'
import { useAccountDetails, useMarketsMutation } from 'api/vendor-details'
import { useStates } from 'api/pc-projects'
import { Market } from 'types/vendor.types'

const InformationCard: React.FC<{
  Icon: React.ElementType
  label: string
  value: string | boolean | any
  register: any
}> = ({ Icon, label, value, register }) => {
  return (
    <HStack h="45px" alignItems="self-start" spacing="16px">
      <Icon as={Icon} fontSize="22px" color="#718096" />
      <Box>
        <FormLabel variant="strong-lable" size="md" m="0" noOfLines={1}>
          {label}
        </FormLabel>
        <Input
          readOnly
          variant="unstyled"
          placeholder="Unstyled"
          value={value}
          color="gray.500"
          w="120px"
          {...register}
          type="text"
        />
      </Box>
    </HStack>
  )
}
type newVendorSkillsTypes = {
  onClose: () => void
  isOpen: boolean
  selectedMarket?: Market
}
export const NewMarketModal: React.FC<newVendorSkillsTypes> = ({ onClose, isOpen, selectedMarket }) => {
  const { data: account } = useAccountDetails()
  const { mutate: createMarkets } = useMarketsMutation()
  const { control, register, handleSubmit, reset, setValue } = useForm()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { stateSelectOptions } = useStates()

  const onSubmit = data => {
    const arg = {
      createdBy: data?.createdBy,
      createdDate: convertDateTimeToServerISO(data?.createdDate),
      modifiedDate: convertDateTimeToServerISO(data?.createdDate),
      modifiedBy: data?.modifiedBy,
      metropolitanServiceArea: data?.metroServiceArea,
      stateId: data?.state.id,
      id: selectedMarket ? selectedMarket.id : '',
      method: selectedMarket ? 'PUT' : 'POST',
    }

    createMarkets(arg, {
      onSuccess() {
        queryClient.invalidateQueries('markets')
        toast({
          title: `Market ${selectedMarket?.id ? 'Updated' : ' Created'}`,
          description: `Market have been ${selectedMarket?.id ? 'Updated' : ' Created'} Successfully.`,
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
        onClose()
        reset()
      },
    })
  }
  const metroValue = useWatch({
    control,
    name: 'metroServiceArea',
  })
  const stateValue = useWatch({
    control,
    name: 'state',
  })

  useEffect(() => {
    if (selectedMarket) {
      setValue('state', { label: selectedMarket?.stateName, id: selectedMarket?.stateId })
      setValue('metroServiceArea', selectedMarket?.metropolitanServiceArea)
    }
  }, [selectedMarket])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          reset()
        }}
        size="3xl"
        isCentered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #E2E8F0">
              <FormLabel variant="strong-label" size="lg">
                {selectedMarket ? `ID-${selectedMarket?.id}` : t(`${VENDOR_MANAGER}.newMarket`)}
              </FormLabel>
            </ModalHeader>
            <ModalCloseButton onClick={() => reset()} />
            <ModalBody>
              <HStack spacing="25px" mt="30px">
                <InformationCard
                  Icon={BiDetail}
                  label={t(`${VENDOR_MANAGER}.createdBy`)}
                  value={selectedMarket ? selectedMarket?.createdBy : account?.firstName}
                  register={register('createdBy')}
                />
                <InformationCard
                  Icon={BiCalendar}
                  label={t(`${VENDOR_MANAGER}.createdDate`)}
                  value={dateFormat(new Date())}
                  register={register('createdDate')}
                />
                {selectedMarket && (
                  <>
                    <InformationCard
                      Icon={BiDetail}
                      label={t(`${VENDOR_MANAGER}.modifiedBy`)}
                      value={selectedMarket?.modifiedBy}
                      register={register('modifiedBy')}
                    />
                    <InformationCard
                      Icon={BiCalendar}
                      label={t(`${VENDOR_MANAGER}.modifiedDate`)}
                      value={dateFormat(selectedMarket?.modifiedDate)}
                      register={register('modifiedDate')}
                    />
                  </>
                )}
              </HStack>
              <Divider border="1px solid #E2E8F0 !important" my="30px" />
              {/* <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
                <GridItem> */}
              <HStack spacing="16px">
                <Box>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${VENDOR_MANAGER}.metroServiceArea`)}
                  </FormLabel>
                  <Input {...register('metroServiceArea')} type="text" variant="required-field" w="215px" />
                </Box>

                <FormControl w="225px">
                  <FormLabel variant="strong-label" size="md">
                    {t(`${VENDOR_MANAGER}.state`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          options={stateSelectOptions}
                          // size="md"
                          selectProps={{ isBorderLeft: true ,menuHeight: '103px'  }}
                          onChange={option => {
                            field.onChange(option)
                          }}
                        />
                      </>
                    )}
                  />
                </FormControl>
              </HStack>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <HStack spacing="16px">
                <Button
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => {
                    onClose()
                    reset()
                  }}
                >
                  {t(`${VENDOR_MANAGER}.cancel`)}
                </Button>
                <Button isDisabled={!metroValue || !stateValue} type="submit" colorScheme="brand">
                  {t(`${VENDOR_MANAGER}.save`)}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
