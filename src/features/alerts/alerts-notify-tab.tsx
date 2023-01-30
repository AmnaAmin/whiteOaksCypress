import { Box, Button, Divider, FormErrorMessage, FormLabel, HStack, Input, Textarea } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useMemo, useRef } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { AlertFormValues } from 'types/alert.type'

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

  const {
    register,
    formState: { errors },
    control,
    watch,
  } = useFormContext<AlertFormValues>()

  const fields = watch()

  const isEnabled = useMemo(() => {
    const { userTypes, recipientEmailAddress, body, recipientPhoneNumber } = fields
    const isOneOfUserTypesSelected = userTypes?.map(userType => userType).some(Boolean)
    return !!(recipientEmailAddress || body || recipientPhoneNumber || isOneOfUserTypesSelected)
  }, [fields])

  const userTypes = useWatch({ control, name: 'userTypes' })

  const phoneNumberRef = useRef<any>()

  return (
    <Box>
      <TextDivider title={t('userTypes')} />

      <HStack mt="30px" spacing="12px">
        {userTypes?.map((user, index) => (
          <CheckboxButton
            {...register(user, {
              required: !userTypes?.length && 'This is required',
            })}
            colorScheme="brand"
            key={index}
            value={user}
            isChecked={user}
          >
            {user}
          </CheckboxButton>
        ))}
      </HStack>

      <TextDivider title={t('emailUser')} />

      <HStack mt="30px">
        <Box>
          <FormLabel variant="strong-label">{t('recipient')}</FormLabel>
          <Input type="email" {...register('recipientEmailAddress')} />
        </Box>

        <Box>
          <FormLabel variant="strong-label">{t('subject')}</FormLabel>
          <Input disabled value="When Project Project ne..." {...register('message')} />
        </Box>
      </HStack>

      <Box mt="30px" w="445px">
        <FormLabel variant="strong-label" size="lg">
          {t('body')}
        </FormLabel>
        <Textarea placeholder="Write here..." {...register('body')} />
      </Box>

      <TextDivider title={t('textUser')} />

      <Box mt="30px" w="215px">
        <Box>
          <FormLabel variant="strong-label" whiteSpace="nowrap">
            {t('recipientPhoneNo')}
          </FormLabel>
          <Controller
            control={control}
            {...register(`recipientPhoneNumber`, {
              validate: (value: any) => {
                if (phoneNumberRef.current) {
                  if (phoneNumberRef.current.value.replace(/\D+/g, '').length === 10) return true
                }

                return false
              },
            })}
            render={({ field }) => {
              return (
                <>
                  <NumberFormat
                    id="phoneNumber"
                    customInput={Input}
                    value={field.value}
                    onChange={e => field.onChange(e)}
                    format="(###)-###-####"
                    mask="_"
                    placeholder="(___)-___-____"
                    getInputRef={phoneNumberRef}
                  />
                  <FormErrorMessage>
                    {errors?.recipientPhoneNumber && errors?.recipientPhoneNumber?.message}
                    {errors?.recipientPhoneNumber && errors?.recipientPhoneNumber!.type === 'validate' && (
                      <span>Phone number should be a 10-digit number</span>
                    )}
                  </FormErrorMessage>
                </>
              )
            }}
          />
          {/* <Input type="number" {...register('recipientPhoneNumber')} /> */}
        </Box>
      </Box>

      <Box mt="30px" w="445px">
        <FormLabel variant="strong-label" size="lg">
          {t('body')}
        </FormLabel>
        <Textarea isDisabled bg="gray.200" value="When Project Project new" w="445px" {...register('message')} />
      </Box>

      <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
        <Button onClick={props.onClose} variant="outline" colorScheme="brand">
          {t('cancel')}
        </Button>
        <Button type="submit" form="alertDetails" isDisabled={!isEnabled} colorScheme="brand">
          {t('save')}
        </Button>
      </HStack>
    </Box>
  )
}
