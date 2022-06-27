import { Box, Button, Divider, FormLabel, HStack, Input, Textarea } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UserTypesField = { id: string; name: string; checked: boolean }
const userTypes = [
  { id: '1', name: 'Admin', checked: false },
  { id: '2', name: 'Accounting', checked: false },
  { id: '3', name: 'FPM', checked: false },
  { id: '4', name: 'Operational', checked: false },
  { id: '5', name: 'Project Coordinator', checked: false },
]

const TextDivider: React.FC<{ title: string }> = props => {
  return (
    <HStack mt="30px">
      <FormLabel variant="strong-label" size="lg" whiteSpace="nowrap" m="0">
        {props.title}
      </FormLabel>
      <Divider borderWidth="1px" />
    </HStack>
  )
}

export const AlertsNotifyTab: React.FC<{ onClose: () => void }> = props => {
  const { t } = useTranslation()

  const { register, control, handleSubmit, watch } = useForm<{
    userTypes: UserTypesField[]
    recepient: string
    subject: string
    bodyFirst: string
    recepientPhoneNo: string
    bodySecond: string
  }>({
    defaultValues: { userTypes: userTypes },
  })
  const onSubmit = data => {
    console.log('data', data)
  }

  const fields = watch()

  const isEnabled = useMemo(() => {
    console.log(fields)
    const { userTypes, recepient, bodyFirst, recepientPhoneNo } = fields
    const isOneOfUserTypesSelected = userTypes.map(userType => userType.checked).some(Boolean)
    return !!(recepient || bodyFirst || recepientPhoneNo || isOneOfUserTypesSelected)
  }, [fields])

  console.log(isEnabled)

  const { fields: userTypeFields } = useFieldArray({ control, name: 'userTypes' })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <TextDivider title="User Types" />

        <HStack mt="30px" spacing="12px">
          {userTypeFields.map((item, index) => {
            return (
              <Controller
                name={`userTypes.${index}`}
                control={control}
                key={index}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <CheckboxButton
                      name={name}
                      key={name}
                      isChecked={item.checked}
                      onChange={event => {
                        const checked = event.target.checked
                        item.checked = checked
                        onChange({ ...item, checked })
                      }}
                    >
                      {item.name}
                    </CheckboxButton>
                  )
                }}
              />
            )
          })}
        </HStack>

        <TextDivider title="Email User" />

        <HStack mt="30px">
          <Box>
            <FormLabel variant="strong-label">Recipient</FormLabel>
            <Input type="email" {...register('recepient')} />
          </Box>

          <Box>
            <FormLabel variant="strong-label">Subject</FormLabel>
            <Input disabled value="When Project Project ne..." {...register('subject')} />
          </Box>
        </HStack>

        <Box mt="30px" w="445px">
          <FormLabel variant="strong-label" size="lg">
            Body
          </FormLabel>
          <Textarea placeholder="Write here..." {...register('bodyFirst')} />
        </Box>

        <TextDivider title="Text User" />

        <Box mt="30px" w="215px">
          <Box>
            <FormLabel variant="strong-label">Recipient Phone No</FormLabel>
            <Input type="number" {...register('recepientPhoneNo')} />
          </Box>
        </Box>

        <Box mt="30px" w="445px">
          <FormLabel variant="strong-label" size="lg">
            Body
          </FormLabel>
          <Textarea isDisabled bg="gray.200" value="When Project Project new" w="445px" {...register('bodySecond')} />
        </Box>

        <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
          <Button onClick={props.onClose} variant="outline" colorScheme="brand">
            {t('cancel')}
          </Button>
          <Button type="submit" isDisabled={!isEnabled} colorScheme="brand">
            {t('save')}
          </Button>
        </HStack>
      </Box>
      <DevTool control={control} />
    </form>
  )
}
