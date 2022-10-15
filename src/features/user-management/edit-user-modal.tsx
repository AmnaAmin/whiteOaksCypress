import {
  Button,
  Checkbox,
  FormControl,
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
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import NumberFormat from 'react-number-format'
import { PasswordField } from './password-field'
import { USER_MANAGEMENT } from './user-management.i8n'

export const EditUserModal = () => {
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
    telephone: string | number
    ext: string
    employeeID: string
  }>()

  const formValues = useWatch({ control })
  const watchRequiredField =
    !formValues?.email ||
    !formValues?.firstName ||
    !formValues?.lastName ||
    !formValues?.accountType ||
    !formValues?.address ||
    !formValues?.telephone

  const onSubmit = value => {}
  return (
    <>
      <Button data-testid="add-user" colorScheme="brand" onClick={onOpen} leftIcon={<BiAddToQueue />}>
        {t(`${USER_MANAGEMENT}.modal.addUser`)}
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
              {t(`${USER_MANAGEMENT}.modal.newUser`)}
            </ModalHeader>
            <ModalCloseButton onClick={() => reset()} />
            <ModalBody>
              <HStack mt="30px" spacing={15}>
                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.email`)}
                  </FormLabel>
                  <Input borderLeft="2.5px solid #4E87F8" type="email" placeholder="Email" {...register('email')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.firstName`)}
                  </FormLabel>
                  <Input
                    borderLeft="2.5px solid #4E87F8"
                    type="text"
                    placeholder="First Name"
                    {...register('firstName')}
                  />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.lastName`)}
                  </FormLabel>
                  <Input
                    borderLeft="2.5px solid #4E87F8"
                    type="text"
                    placeholder="Last Name"
                    {...register('lastName')}
                  />
                </FormControl>
              </HStack>

              <HStack mt="30px">
                <PasswordField errors={errors} register={register} />
              </HStack>

              <HStack mt="30px" spacing={15}>
                <FormControl w="215px">
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.accountType`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="accountType"
                    render={({ field }) => (
                      <>
                        <ReactSelect selectProps={{ isBorderLeft: true }} {...field} options={[]} />
                      </>
                    )}
                  />
                </FormControl>

                <FormControl w="215px">
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.language`)}
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
                  <Checkbox mt="25px" fontSize="16px" fontWeight={400} color="#718096" {...register('activated')}>
                    {t(`${USER_MANAGEMENT}.modal.activated`)}
                  </Checkbox>
                </FormControl>
              </HStack>

              <HStack mt="30px" spacing={15}>
                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.address`)}
                  </FormLabel>
                  <Input borderLeft="2.5px solid #4E87F8" type="text" placeholder="Address" {...register('address')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.city`)}
                  </FormLabel>
                  <Input type="text" placeholder="City" {...register('city')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.state`)}
                  </FormLabel>
                  <Input type="text" placeholder="State" {...register('state')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.zipcode`)}
                  </FormLabel>
                  <Input type="number" {...register('zipCode')} />
                </FormControl>
              </HStack>

              <HStack mt="30px" spacing={15}>
                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.telephone`)}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="telephone"
                    render={({ field }) => {
                      return (
                        <>
                          <NumberFormat
                            customInput={Input}
                            value={field.value}
                            onChange={e => field.onChange(e)}
                            format="(###)-###-####"
                            mask="_"
                            placeholder="(___)-___-____"
                            borderLeft="2.5px solid #4E87F8"
                          />
                        </>
                      )
                    }}
                  />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.ext`)}
                  </FormLabel>
                  <Input type="text" placeholder="Ext" {...register('ext')} />
                </FormControl>

                <FormControl w={215}>
                  <FormLabel variant="strong-label" size="md">
                    {t(`${USER_MANAGEMENT}.modal.employeeID`)}
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
                {t(`${USER_MANAGEMENT}.modal.cancel`)}
              </Button>
              <Button type="submit" colorScheme="brand" isDisabled={!!watchRequiredField}>
                {t(`${USER_MANAGEMENT}.modal.save`)}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
