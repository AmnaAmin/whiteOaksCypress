import React, { useEffect, useState } from 'react'
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
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import Select from 'components/form/react-select'

import { BiCalendar, BiDetail, BiTrash } from 'react-icons/bi'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { dateFormat, dateISOFormat } from 'utils/date-time-utils'
import { useAccountDetails, useVendorSkillDelete, useVendorSkillsMutation } from 'api/vendor-details'
import { useQueryClient } from 'react-query'
import { VENDOR_MANAGER } from './vendor-manager.i18n'
import { t } from 'i18next'
import { Market } from 'types/vendor.types'
import { useTranslation } from 'react-i18next'
import { ConfirmationBox } from 'components/Confirmation'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { SERVICE_SKILLS_OPTIONS } from 'constants/index'

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
  const { mutate: createVendorSkills, isLoading } = useVendorSkillsMutation()
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const watchServicesValue = useWatch({
    control,
    name: 'services',
  })

  const toast = useToast()
  const queryClient = useQueryClient()
  const { isOpen: isOpenDeleteSkill, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const [stateForServiceDD, setStateForServiceDD] = useState(false)
  const { mutate: deleteVendorSkillMutate, isLoading: loadingDelete } = useVendorSkillDelete()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('VENDORSKILL.READ')
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
      services: data.services.label.toUpperCase(),
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
    if (selectedVendorSkills?.services === 'YES') {
      setValue('services', {
        label: 'Yes',
      })
    } else {
      setValue('services', {
        label: 'No',
      })
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
              <HStack spacing={'18px'}>
                <FormControl w={'225px'} isInvalid={!!errors?.skill}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${VENDOR_MANAGER}.skills`)}
                  </FormLabel>
                  <Input
                    {...register('skill', {
                      required: 'This is a required field',
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    })}
                    onChange={e => {
                      const title = e?.target.value
                      setValue('skill', title)
                      if (title?.length > 255) {
                        setError('skill', {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors('skill')
                      }
                    }}
                    type="text"
                    variant="required-field"
                    w="215px"
                    defaultValue={selectedVendorSkills?.skill}
                    title={watchvalue}
                    isDisabled={isReadOnly}
                  />
                  {!!errors?.skill && (
                    <FormErrorMessage data-testid="skill_error">{errors?.skill?.message}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl w="225px" data-testid="services_select">
                  <FormLabel variant="strong-label" size="md">
                    {t(`${VENDOR_MANAGER}.services`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="services"
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          options={SERVICE_SKILLS_OPTIONS}
                          isDisabled={isReadOnly}
                          value={field.value}
                          size="md"
                          selectProps={{ isBorderLeft: true, menuHeight: '103px' }}
                          onChange={option => {
                            field.onChange(option)
                            if (option.value) setStateForServiceDD(true)
                          }}
                        />
                      </>
                    )}
                  />
                </FormControl>
              </HStack>
            </ModalBody>
            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <HStack justifyContent="start" w="100%">
                {!isReadOnly && selectedVendorSkills && (
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
                <>
                  {!isReadOnly && (
                    <Button
                      disabled={isLoading || !watchServicesValue || !watchvalue || watchvalue.trim() === ''}
                      type="submit"
                      colorScheme="brand"
                      data-testid="vendor_skill_save_btn"
                    >
                      {t(`${VENDOR_MANAGER}.save`)}
                    </Button>
                  )}
                </>
              </HStack>
            </ModalFooter>
            {(isOpenDeleteSkill || stateForServiceDD) && (
              <ConfirmationBox
                title={!stateForServiceDD ? t(`${VENDOR_MANAGER}.delConfirmText`) : ''}
                content={
                  !stateForServiceDD
                    ? t(`${VENDOR_MANAGER}.delConfirmContent`)
                    : t(`${VENDOR_MANAGER}.profitPercentageText`)
                }
                isOpen={isOpenDeleteSkill || stateForServiceDD}
                onClose={onCloseDisclosure}
                isLoading={loadingDelete}
                onConfirm={() => {
                  if (!stateForServiceDD) {
                    deleteVendorSkill()
                  } else setStateForServiceDD(false)
                }}
                yesButtonText={!stateForServiceDD ? `Yes` : 'Ok'}
                showNoButton={!stateForServiceDD ?? true}
                showCrossButton={!stateForServiceDD ?? false}
              />
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
