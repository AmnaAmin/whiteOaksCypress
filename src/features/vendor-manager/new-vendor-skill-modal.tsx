import React from 'react'
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
import { useAccountDetails, useVendorSkillsMutation } from 'api/vendor-details'
import { convertDateTimeToServerISO } from 'components/table/util'
import { useQueryClient } from 'react-query'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { t } from 'i18next'
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
  selectedVendorSkills?: Market
}
export const NewVendorSkillsModal: React.FC<newVendorSkillsTypes> = ({ onClose, isOpen, selectedVendorSkills }) => {
  const { data: account } = useAccountDetails()
  const { mutate: createVendorSkills } = useVendorSkillsMutation()
  const { control, register, handleSubmit, reset } = useForm()
  const toast = useToast()
  const queryClient = useQueryClient()

  const onSubmit = data => {
    const arg = {
      createdBy: data?.createdBy,
      createdDate: convertDateTimeToServerISO(data?.createdDate),
      modifiedDate: convertDateTimeToServerISO(data?.createdDate),
      modifiedBy: data?.modifiedBy,
      skill: data?.skill,
      id: selectedVendorSkills?.id,
      method: selectedVendorSkills ? 'PUT' : 'POST',
    }

    createVendorSkills(arg, {
      onSuccess() {
        queryClient.invalidateQueries('trades')
        toast({
          title: `Vendor Skill ${selectedVendorSkills?.id ? 'Updated' : ' Created'}`,
          description: `Vendor Skill have been ${selectedVendorSkills?.id ? 'Updated' : ' Created'} Successfully.`,
          status: 'success',
          isClosable: true,
        })
        onClose()
        reset()
      },
    })
  }
  const watchvalue = useWatch({
    control,
    name: 'skill',
  })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #E2E8F0">
              <FormLabel variant="strong-label" size="lg">
                {selectedVendorSkills ? `ID-${selectedVendorSkills?.id}` : t(`${VENDOR_MANAGER}.newVendorSkills`)}
              </FormLabel>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack spacing="25px" mt="30px">
                <InformationCard
                  Icon={BiDetail}
                  label={t(`${VENDOR_MANAGER}.createdBy`)}
                  value={selectedVendorSkills ? selectedVendorSkills?.createdBy : account?.firstName}
                  register={register('createdBy')}
                />
                <InformationCard
                  Icon={BiCalendar}
                  label={t(`${VENDOR_MANAGER}.createdDate`)}
                  value={dateFormat(new Date())}
                  register={register('createdDate')}
                />
                {selectedVendorSkills && (
                  <>
                    <InformationCard
                      Icon={BiDetail}
                      label={t(`${VENDOR_MANAGER}.modifiedBy`)}
                      value={selectedVendorSkills?.modifiedBy}
                      register={register('modifiedBy')}
                    />
                    <InformationCard
                      Icon={BiCalendar}
                      label={t(`${VENDOR_MANAGER}.modifiedDate`)}
                      value={dateFormat(selectedVendorSkills?.modifiedDate)}
                      register={register('modifiedDate')}
                    />
                  </>
                )}
              </HStack>
              <Divider border="1px solid #E2E8F0 !important" my="30px" />
              <Box>
                <FormLabel variant="strong-label" size="md">
                  {t(`${VENDOR_MANAGER}.skills`)}
                </FormLabel>
                <Input
                  {...register('skill')}
                  type="text"
                  borderLeft="2.5px solid blue"
                  w="215px"
                  defaultValue={selectedVendorSkills?.skill}
                />
              </Box>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <HStack spacing="16px">
                <Button variant="outline" colorScheme="brand" onClick={onClose}>
                  {t(`${VENDOR_MANAGER}.cancel`)}
                </Button>
                <Button disabled={!watchvalue} type="submit" colorScheme="brand">
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
