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
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { BiCalendar, BiDetail, BiTrash } from 'react-icons/bi'
import { useForm, useWatch } from 'react-hook-form'
import { dateFormat, dateISOFormat } from 'utils/date-time-utils'
import { useAccountDetails, useVendorSkillDelete, useVendorSkillsMutation } from 'api/vendor-details'
import { useQueryClient } from 'react-query'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { t } from 'i18next'
import { Market } from 'types/vendor.types'
import { useTranslation } from 'react-i18next'
import { ConfirmationBox } from 'components/Confirmation'

const InformationCard: React.FC<{ label: string; value: string; icons: React.ElementType }> = ({
  label,
  value,
  icons,
}) => {
  const { t } = useTranslation()
  return (
    <HStack spacing={4}>
      <Box h="37px">
        <Icon as={icons} fontSize={20} color="gray.500" />
      </Box>
      <Box w="135px">
        <Text fontWeight={500} fontSize="14px" color="gray.600" isTruncated title={t(`${VENDOR_MANAGER}.${label}`)}>
          {t(`${VENDOR_MANAGER}.${label}`)}
        </Text>
        <Text fontWeight={400} fontSize="14px" color="gray.500" h="18px" isTruncated title={value}>
          {value}
        </Text>
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
  const { mutate: createVendorSkills , isLoading} = useVendorSkillsMutation()
  const { control, register, handleSubmit, reset, setValue } = useForm()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { isOpen: isOpenDeleteSkill, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const { mutate: deleteVendorSkillMutate, isLoading: loadingDelete } = useVendorSkillDelete()

  const deleteVendorSkill = () => {
    deleteVendorSkillMutate(selectedVendorSkills, {
      onSuccess: () => {
        onCloseDisclosure()
        onClose()
      },
    })
  }

  const onSubmit = data => {
    const arg = {
      createdBy: selectedVendorSkills ? selectedVendorSkills?.createdBy : account?.createdBy,
      createdDate: dateISOFormat(selectedVendorSkills ? selectedVendorSkills?.createdDate : account?.createdDate),
      modifiedDate: dateISOFormat(selectedVendorSkills ? selectedVendorSkills?.createdDate : account?.createdDate),
      modifiedBy: selectedVendorSkills ? selectedVendorSkills?.modifiedBy : account?.modifiedBy,
      skill: data?.skill,
      id: selectedVendorSkills?.id,
      method: selectedVendorSkills ? 'PUT' : 'POST',
      active: selectedVendorSkills?.active,
    }

    createVendorSkills(arg, {
      onSuccess() {
        queryClient.invalidateQueries('trades')
        toast({
          title: `Vendor Skill ${selectedVendorSkills?.id ? 'Updated' : ' Created'}`,
          description: `Vendor Skill have been ${selectedVendorSkills?.id ? 'Updated' : ' Created'} Successfully.`,
          status: 'success',
          isClosable: true,
          position: 'top-left',
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

  useEffect(() => {
    if (selectedVendorSkills) {
      setValue('skill', selectedVendorSkills?.skill)
    }
  }, [selectedVendorSkills])

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
          <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
            <ModalHeader borderBottom="1px solid #E2E8F0">
              <FormLabel variant="strong-label" size="lg">
                {selectedVendorSkills ? `ID-${selectedVendorSkills?.id}` : t(`${VENDOR_MANAGER}.newVendorSkills`)}
              </FormLabel>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack spacing="25px" mt="20px">
                <InformationCard
                  icons={BiDetail}
                  label={'createdBy'}
                  value={selectedVendorSkills ? selectedVendorSkills?.createdBy : account?.firstName}
                />
                <InformationCard
                  icons={BiCalendar}
                  label={'createdDate'}
                  value={selectedVendorSkills ? dateFormat(selectedVendorSkills?.createdDate!) : dateFormat(new Date())}
                />
                {selectedVendorSkills && (
                  <>
                    <InformationCard icons={BiDetail} label={'modifiedBy'} value={selectedVendorSkills?.modifiedBy} />
                    <InformationCard
                      icons={BiCalendar}
                      label={'modifiedDate'}
                      value={dateFormat(selectedVendorSkills?.modifiedDate)}
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
                  variant="required-field"
                  w="215px"
                  defaultValue={selectedVendorSkills?.skill}
                  title={watchvalue}
                />
              </Box>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <HStack justifyContent="start" w="100%">
                {selectedVendorSkills && (
                  <Button variant="outline" colorScheme="brand" size="md" onClick={onOpen} leftIcon={<BiTrash />}>
                    {t(`${VENDOR_MANAGER}.deleteSkill`)}
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
                <Button disabled={!watchvalue || watchvalue.trim() === ''} type="submit" colorScheme="brand">
                  {t(`${VENDOR_MANAGER}.save`)}
                </Button>
              </HStack>
            </ModalFooter>
            {isOpenDeleteSkill && (
              <ConfirmationBox
                title={t(`${VENDOR_MANAGER}.delConfirmText`)}
                content={t(`${VENDOR_MANAGER}.delConfirmContent`)}
                isOpen={isOpenDeleteSkill}
                onClose={onCloseDisclosure}
                isLoading={loadingDelete}
                onConfirm={deleteVendorSkill}
              />
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
