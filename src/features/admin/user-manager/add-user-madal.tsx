import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { PasswordField } from './password-field'

export const AddUserMadal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<{
    email: string
    password: any
    firstName: string
    lastName: string
    accountType: string
    language: string
    activated: boolean
    address: string
    city: string
    state: string
    zipCode: string
    telephone: string
    ext: string
    employeeID: string
  }>()

  const onSubmit = value => {
    console.log('FormValue', value)
  }
  return (
    <>
      <Button colorScheme="brand" onClick={onOpen} leftIcon={<BiAddToQueue />}>
        Add User
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          reset()
        }}
        size="6xl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader borderBottom="1px solid #E2E8F0" fontSize="16px" fontWeight={500} color="#4A5568">
              New User
            </ModalHeader>
            <ModalCloseButton onClick={() => reset()} />
            <ModalBody>
              <HStack mt="30px">
                <FormControl w={215} isInvalid={!!errors?.email}>
                  {console.log(!!errors?.email)}
                  <FormLabel variant="strong-label" size="md">
                    Email
                  </FormLabel>
                  <Input borderLeft="2.5px solid #4E87F8" type="email" placeholder="Email" {...register('email')} />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl w={215} isInvalid={!!errors.firstName}>
                  <FormLabel variant="strong-label" size="md">
                    First Name
                  </FormLabel>
                  <Input
                    borderLeft="2.5px solid #4E87F8"
                    type="text"
                    placeholder="First Name"
                    {...register('firstName')}
                  />
                  <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
                </FormControl>

                <FormControl w={215} isInvalid={!!errors.lastName}>
                  <FormLabel variant="strong-label" size="md">
                    Last Name
                  </FormLabel>
                  <Input
                    borderLeft="2.5px solid #4E87F8"
                    type="text"
                    placeholder="Last Name"
                    {...register('lastName')}
                  />
                  <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack mt="30px">
                <PasswordField errors={errors} register={register} />
              </HStack>

              <HStack mt="30px">
                {/* <FormControl w="215px" isInvalid={!!errors.accountType}>
                  <FormLabel variant="strong-label" size="md">
                    Account Type
                  </FormLabel>
                  <Controller
                    control={control}
                    name="accountType"
                    rules={{ required: 'This is required' }}
                    render={({ field, fieldState }) => (
                      <>
                        <ReactSelect selectProps={{ isBorderLeft: true }} {...field} options={[]} />
                        <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl> */}

                <FormControl w="215px">
                  <FormLabel variant="strong-label" size="md">
                    Language
                  </FormLabel>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field }) => (
                      <>
                        <ReactSelect {...field} options={[]} />
                      </>
                    )}
                  />
                </FormControl>

                <FormControl w={215}>
                  <Checkbox
                    mt="25px"
                    ml="10px"
                    fontSize="16px"
                    fontWeight={400}
                    color="#718096"
                    {...register('activated')}
                  >
                    Activated
                  </Checkbox>
                </FormControl>
              </HStack>

              <HStack mt="30px">
                <FormControl w={215} isInvalid={!!errors.address}>
                  <FormLabel variant="strong-label" size="md">
                    Address
                  </FormLabel>
                  <Input borderLeft="2.5px solid #4E87F8" type="text" placeholder="Address" {...register('address')} />
                  <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    City
                  </FormLabel>
                  <Input type="text" placeholder="City" {...register('city')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    State
                  </FormLabel>
                  <Input type="text" placeholder="State" {...register('state')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    Zip code
                  </FormLabel>
                  <Input type="number" {...register('zipCode')} />
                </FormControl>
              </HStack>

              <HStack mt="30px">
                <FormControl w={215} isInvalid={!!errors.telephone}>
                  <FormLabel variant="strong-label" size="md">
                    Telephone
                  </FormLabel>
                  <Input
                    borderLeft="2.5px solid #4E87F8"
                    type="number"
                    placeholder="Telephone"
                    {...register('telephone')}
                  />
                  <FormErrorMessage>{errors.telephone && errors.telephone.message}</FormErrorMessage>
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    Ext
                  </FormLabel>
                  <Input type="text" placeholder="Ext" {...register('ext')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    Employee ID
                  </FormLabel>
                  <Input type="text" {...register('employeeID')} />
                </FormControl>
              </HStack>
            </ModalBody>

            <ModalFooter borderTop="1px solid #E2E8F0" mt="30px">
              <Button
                variant="outline"
                colorScheme="brand"
                mr={3}
                onClick={() => {
                  onClose()
                  reset()
                }}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" colorScheme="brand">
                {t('save')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
