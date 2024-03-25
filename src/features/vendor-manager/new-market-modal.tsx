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
import { Controller, useForm } from 'react-hook-form'
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
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { CLIENTS } from 'features/clients/clients.i18n'

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
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('MARKET.READ')
  const defaultValues: any = useMemo(() => {
    return {
      state: { label: selectedMarket?.stateName, id: selectedMarket?.stateId },
      metroServiceArea: selectedMarket?.metropolitanServiceArea,
      lienDue: stateSelectOptions?.find(s => s.id === selectedMarket?.stateId)?.lienDue,
      abbreviation: selectedMarket?.abbreviation,
    }
  }, [stateSelectOptions])

  const { control, register, handleSubmit, reset, setValue, watch, setError,clearErrors, formState: { errors },trigger  } = useForm<{
    state: SelectOption
    metroServiceArea: string
    lienDue: string | number
    createdBy: string
    createdDate: string
    modifiedBy: string
    modifiedDate: string
    abbreviation?: string
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
      abbreviation: data?.abbreviation,
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
  const [metroValue, stateValue, lienDueValue] = watch(['metroServiceArea', 'state', 'lienDue'])

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
                  value={selectedMarket ? dateFormat(selectedMarket?.createdDate as any) : dateFormat(new Date())}
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
                  <FormControl  isInvalid={!!errors?.metroServiceArea} h='77px'>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${VENDOR_MANAGER}.metroServiceArea`)}
                  </FormLabel>
                  <Input
                    {...register('metroServiceArea',{
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    })}
                    type="text"
                    variant="required-field"
                    w="215px"
                    disabled={isReadOnly}
                    onChange={e => {
                      const title = e?.target.value
                      setValue('metroServiceArea', title)
                      if (title?.length > 255) {
                        setError('metroServiceArea', {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors('metroServiceArea')
                      }
                    }}
                  />
                   {!!errors?.metroServiceArea && (
                      <FormErrorMessage data-testid="market_error">{errors?.metroServiceArea?.message}</FormErrorMessage>
                    )}
                  </FormControl>
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
                          classNamePrefix={'stateSelectOptions'}
                          options={stateSelectOptions}
                          isDisabled={isReadOnly}
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
                </FormControl >
                <FormControl w="225px"  isInvalid={!!errors?.lienDue}>
                  <FormLabel variant="strong-label" size="md" htmlFor="lienDue" noOfLines={1}>
                    {t(`${VENDOR_MANAGER}.lienDue`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    rules={{
                      maxLength: { value: 2147483647, message: 'Please use 2147483647 characters only.' },
                    }}
                    name="lienDue"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <NumberFormat
                            customInput={CustomRequiredInput}
                            value={field.value}
                            disabled={isReadOnly}
                            onValueChange={e => {
                              clearErrors('lienDue')
                              const inputValue = e.value ?? ''
                              field.onChange(inputValue)
                              trigger('lienDue')
                            }}
                          />
                          {!!errors?.lienDue && (
                      <FormErrorMessage data-testid="market_error">{errors?.lienDue?.message}</FormErrorMessage>
                    )}
                        </>
                      )
                    }}
                  />
                </FormControl>
              </HStack>
              <Box mt={'5px'}>
                <FormControl isInvalid={!!errors?.abbreviation} h='77px'>
                <FormLabel variant="strong-label" size="md">
                  {t(`${CLIENTS}.abbreviation`)}
                </FormLabel>

                <Input id="abbreviation" w="215px" {...register('abbreviation',{
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    })}
                     isDisabled={isReadOnly}  
                     onChange={e => {
                      const title = e?.target.value
                      setValue('abbreviation', title)
                      if (title?.length > 255) {
                        setError('abbreviation', {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors('abbreviation')
                      }
                    }}/>
                     {!!errors?.abbreviation && (
                      <FormErrorMessage data-testid="abbreviation_error">{errors?.abbreviation?.message}</FormErrorMessage>
                    )}
                </FormControl>
              </Box>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px" justifyContent="space-between">
              <HStack spacing="16px">
                {!isReadOnly && selectedMarket && (
                  <Button
                    data-testid="delete-Market-btn"
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
                <>
                  {!isReadOnly && (
                    <Button
                      isDisabled={!metroValue || metroValue.trim() === '' || !stateValue || !lienDueValue}
                      type="submit"
                      colorScheme="brand"
                    >
                      {t(`${VENDOR_MANAGER}.save`)}
                    </Button>
                  )}
                </>
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
