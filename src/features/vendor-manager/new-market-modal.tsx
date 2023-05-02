import React, { useEffect, useMemo, useRef } from 'react'
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  Text,
  Icon,
  Spacer,
  AlertDialogCloseButton,
  FormErrorMessage,
} from '@chakra-ui/react'
import { BiCalendar, BiDetail, BiTrash } from 'react-icons/bi'
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
import { MARKET_KEY, useDeleteMarket } from 'api/market'
import NumberFormat from 'react-number-format'
import { CustomRequiredInput } from 'components/input/input'
import { SelectOption } from 'types/transaction.type'

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
  const { stateSelectOptions } = useStates()
  const defaultValues: any = useMemo(() => {
    return {
      state: { label: selectedMarket?.stateName, id: selectedMarket?.stateId },
      metroServiceArea: selectedMarket?.metropolitanServiceArea,
      lienDue: stateSelectOptions?.find(s => s.id === selectedMarket?.stateId)?.lienDue,
    }
  }, [stateSelectOptions])

  const { control, register, handleSubmit, reset, setValue } = useForm<{
    state: SelectOption
    metroServiceArea: string
    lienDue: string | number
    createdBy: string
    createdDate: string
    modifiedBy: string
    modifiedDate: string
  }>()

  useEffect(() => {
    reset({
      ...defaultValues,
    })
  }, [reset, stateSelectOptions?.length])

  const toast = useToast()
  const queryClient = useQueryClient()

  const { mutate: deleteMarket } = useDeleteMarket()

  const onDelete = () => {
    deleteMarket(selectedMarket)
    onClose()
  }

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
      lienDue: data?.lienDue,
    }

    createMarkets(arg, {
      onSuccess() {
        queryClient.invalidateQueries(MARKET_KEY)
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
  const lienDue = useWatch({
    control,
    name: 'lienDue',
  })

  const {
    isOpen: confirmationDialogIsOpen,
    onOpen: confirmationDialogOpen,
    onClose: confirmationDialogClose,
  } = useDisclosure()

  const cancelRef = useRef()

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
                          selectProps={{ isBorderLeft: true, menuHeight: '103px' }}
                          onChange={option => {
                            field.onChange(option)
                            setValue('lienDue', stateSelectOptions?.find(s => s.id === option?.id)?.lienDue)
                          }}
                        />
                      </>
                    )}
                  />
                </FormControl>
                <FormControl w="225px">
                  <FormLabel variant="strong-label" size="md" htmlFor="lienDue" noOfLines={1}>
                    {t(`${VENDOR_MANAGER}.lienDue`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="lienDue"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            customInput={CustomRequiredInput}
                            value={field.value}
                            onValueChange={values => {
                              const { floatValue } = values
                              field.onChange(floatValue ?? '')
                            }}
                          />
                          <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
                        </>
                      )
                    }}
                  />
                </FormControl>
              </HStack>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px" justifyContent="space-between">
              <HStack spacing="16px">
                {selectedMarket && (
                  <Button
                    variant="outline"
                    colorScheme="brand"
                    onClick={() => {
                      confirmationDialogOpen()
                      reset()
                    }}
                  >
                    {t(`${VENDOR_MANAGER}.deleteMarket`)}
                  </Button>
                )}
              </HStack>
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
                <Button isDisabled={!metroValue || !stateValue || !lienDue} type="submit" colorScheme="brand">
                  {t(`${VENDOR_MANAGER}.save`)}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      <AlertDialog
        isOpen={confirmationDialogIsOpen}
        leastDestructiveRef={cancelRef as any}
        onClose={confirmationDialogClose}
        motionPreset="slideInBottom"
        isCentered={true}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" borderBottom="1px solid #A0AEC0" paddingBottom="3">
            <HStack>
              <Icon as={BiTrash} color="gray/600" />
              <Text color="gray/600" fontWeight="500" fontSize="14px" letterSpacing="0.5" lineHeight="28px">
                {t(`${VENDOR_MANAGER}.deleteMarketAlertTitle`)}
              </Text>
              <Spacer />
            </HStack>
          </AlertDialogHeader>
          <AlertDialogCloseButton />

          <AlertDialogBody mt="10px">
            <Text color="gray/600" as="h3" fontSize="14px" letterSpacing="0.5" lineHeight="28px">
              {t(`${VENDOR_MANAGER}.deleteMarketAlertMessage`)}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            {selectedMarket && (
              <Button colorScheme="brand" onClick={onDelete} mr={3} ml={5}>
                Delete
              </Button>
            )}

            <Button variant="outline" colorScheme="brand" ref={cancelRef as any} onClick={confirmationDialogClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
