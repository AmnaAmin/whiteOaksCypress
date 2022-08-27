import React, { useState } from 'react'
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
} from '@chakra-ui/react'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { useForm, useWatch } from 'react-hook-form'
import { dateFormat } from 'utils/date-time-utils'
import { useAccountDetails, useVendorSkillsMutation } from 'utils/vendor-details'
import { convertDateTimeToServerISO } from 'components/table/util'
import { useQueryClient } from 'react-query'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { t } from 'i18next'
import Select from 'components/form/react-select'
import { useStates } from 'utils/pc-projects'

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
        <FormLabel variant="strong-lable" size="md" m="0">
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
  selectedWorkOrder?: any
}
export const NewMarketModal: React.FC<newVendorSkillsTypes> = ({ onClose, isOpen, selectedWorkOrder }) => {
  const { data: account } = useAccountDetails()
  const { mutate: createVendorSkills } = useVendorSkillsMutation()
  const { control, register, handleSubmit, reset } = useForm()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { stateSelectOptions } = useStates()
  const [addressInfo, setAddressInfo] = useState()

  const onSubmit = data => {
    const arg = {
      createdBy: data?.createdBy,
      createdDate: convertDateTimeToServerISO(data?.createdDate),
      modifiedDate: convertDateTimeToServerISO(data?.createdDate),
      modifiedBy: data?.modifiedBy,
      skill: data?.skill,
      id: selectedWorkOrder?.id,
      method: selectedWorkOrder ? 'PUT' : 'POST',

      //   method: selectedWorkOrder ? 'PUT' : 'POST',
      //   createdBy: 'Admin',
      //   createdDate: '2022-08-28T00:00:00.000Z',
      //   metropolitanServiceArea: 'DC',
      //   modifiedDate: null,
      //   stateId: '4',
    }

    createVendorSkills(arg, {
      onSuccess() {
        queryClient.invalidateQueries('trades')
        toast({
          title: `Vendor Skill ${selectedWorkOrder?.id ? 'Updated' : ' Created'}`,
          description: `Vendor Skill have been ${selectedWorkOrder?.id ? 'Updated' : ' Created'} Successfully.`,
          status: 'success',
          isClosable: true,
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

  console.log('addressInfo :', addressInfo)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #E2E8F0">
              <FormLabel variant="strong-label" size="lg">
                {t(`${VENDOR_MANAGER}.newVendorSkills`)}
              </FormLabel>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack spacing="25px" mt="30px">
                <InformationCard
                  Icon={BiDetail}
                  label={t(`${VENDOR_MANAGER}.createdBy`)}
                  value={selectedWorkOrder ? selectedWorkOrder?.createdBy : account?.firstName}
                  register={register('createdBy')}
                />
                <InformationCard
                  Icon={BiCalendar}
                  label={t(`${VENDOR_MANAGER}.createdDate`)}
                  value={dateFormat(new Date())}
                  register={register('createdDate')}
                />
                {selectedWorkOrder && (
                  <>
                    <InformationCard
                      Icon={BiDetail}
                      label={t(`${VENDOR_MANAGER}.modifiedBy`)}
                      value={selectedWorkOrder?.modifiedBy}
                      register={register('modifiedBy')}
                    />
                    <InformationCard
                      Icon={BiCalendar}
                      label={t(`${VENDOR_MANAGER}.modifiedDate`)}
                      value={dateFormat(selectedWorkOrder?.modifiedDate)}
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
                  <Input
                    {...register('metroServiceArea')}
                    type="text"
                    variant="required-field"
                    w="215px"
                    defaultValue={selectedWorkOrder?.skill}
                  />
                </Box>
                <Box w="215px">
                  <FormLabel variant="strong-label" size="md">
                    {t(`${VENDOR_MANAGER}.state`)}
                  </FormLabel>
                  <Select
                    {...register('state')}
                    options={stateSelectOptions}
                    // size="md"
                    // value={field.value}
                    selectProps={{ isBorderLeft: true }}
                    onChange={option => {
                      setAddressInfo(option)
                    }}
                  />
                </Box>
              </HStack>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <HStack spacing="16px">
                <Button variant="outline" colorScheme="brand" onClick={onClose}>
                  {t(`${VENDOR_MANAGER}.cancel`)}
                </Button>
                <Button disabled={!metroValue || !stateValue} type="submit" colorScheme="brand">
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
