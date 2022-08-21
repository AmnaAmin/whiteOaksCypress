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
} from '@chakra-ui/react'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { useForm, useWatch } from 'react-hook-form'
import { dateFormat } from 'utils/date-time-utils'
// import { usePasswordUpdateMutation } from 'utils/user-account'
import { useAccountDetails } from 'utils/vendor-details'
import { useVendorSkillsMutation } from 'utils/vendor-skills-api'

const InformationCard: React.FC<{ Icon: React.ElementType; label: string; value: string | boolean; register: any }> = ({
  Icon,
  label,
  value,
  register,
}) => {
  return (
    <HStack h="45px" alignItems="self-start" spacing="16px">
      <Icon as={Icon} fontSize="22px" color="#718096" />
      <Box>
        <FormLabel variant="strong-lable" size="md" m="0">
          {label}
        </FormLabel>
        {/* <FormLabel variant="light-label" size="md" m="0">
          {value}
        </FormLabel> */}
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
}

export const NewVendorSkillsModal: React.FC<newVendorSkillsTypes> = ({ onClose, isOpen }) => {
  const { data: account } = useAccountDetails()
  const { mutate: createVendorSkills } = useVendorSkillsMutation()

  const { control, register, handleSubmit } = useForm()
  const onSubmit = data => {
    console.log('Skills', data)
    createVendorSkills(data as any)
  }
  const watchvalue = useWatch({
    control,
    name: 'skills',
  })
  // const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #E2E8F0">
              <FormLabel variant="strong-label" size="lg">
                New vendor skill
              </FormLabel>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack spacing="25px" mt="30px">
                <InformationCard
                  Icon={BiDetail}
                  label={'Created By'}
                  value={account?.firstName}
                  register={register('Created by')}
                />
                <InformationCard
                  Icon={BiCalendar}
                  label={'Created date'}
                  value={dateFormat(new Date())}
                  register={register('Created date')}
                />
              </HStack>
              <Divider border="1px solid #E2E8F0 !important" my="30px" />
              <Box>
                <FormLabel variant="strong-label" size="md">
                  Skills
                </FormLabel>
                <Input {...register('skills')} type="text" borderLeft="2.5px solid blue" w="215px" />
              </Box>
            </ModalBody>

            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <HStack spacing="16px">
                <Button variant="outline" colorScheme="brand" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={!watchvalue} type="submit" colorScheme="brand">
                  Save
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
