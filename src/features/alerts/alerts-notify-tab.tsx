import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { useCreateMessageContentAndQuery } from 'api/alerts'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useEffect, useMemo, useRef } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { AlertFormValues, availableUsers } from 'types/alert.type'

const TextDivider = ({ title }) => {
  return (
    <HStack mt="30px">
      <FormLabel variant="strong-label" size="md" whiteSpace="nowrap" m="0">
        {title}
      </FormLabel>
      <Divider borderWidth="1px" />
    </HStack>
  )
}

export const AlertsNotifyTab = ({ onClose }) => {
  const { t } = useTranslation()

  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<AlertFormValues>()

  const fields = watch()

  const isEnabled = useMemo(() => {
    const { userTypes, recipientEmailAddress, body, recipientPhoneNumber } = fields
    const isOneOfUserTypesSelected = userTypes?.map(userType => userType).some(Boolean)
    return !!(recipientEmailAddress || body || recipientPhoneNumber || isOneOfUserTypesSelected)
  }, [fields])
  const phoneNumberRef = useRef<any>()
  const watchUserTypes = useWatch({ control, name: 'userTypes' })
  const { messageContent, alertRuleQuery } = useCreateMessageContentAndQuery(control)

  useEffect(() => {
    if (messageContent) {
      setValue('message', messageContent)
    }
    if (alertRuleQuery) {
      setValue('alertRuleQuery', alertRuleQuery)
    }
  }, [messageContent, alertRuleQuery])

  return (
    <Box>
      <Box h={'calc(100vh - 250px)'} overflow={'auto'}>
        <TextDivider title={t('userTypes')} />

        <HStack mt="30px" spacing="12px">
          {availableUsers?.map((user, index) => {
            return (
              <Controller
                name={`userTypes`}
                control={control}
                key={index}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <CheckboxButton
                      name={name + '-' + index}
                      key={user}
                      isChecked={watchUserTypes?.includes(user)}
                      data-testid={`userType.${user}`}
                      onChange={event => {
                        const checked = event.target.checked
                        if (checked) {
                          onChange(watchUserTypes ? [...watchUserTypes, user] : [user])
                        } else {
                          onChange(watchUserTypes?.filter(w => w !== user) ?? [])
                        }
                      }}
                    >
                      {user}
                    </CheckboxButton>
                  )
                }}
              />
            )
          })}
        </HStack>

        <TextDivider title={t('emailUser')} />

        <HStack mt="30px">
          <Box>
            <FormLabel variant="strong-label" size="md">
              {t('recipient')}
            </FormLabel>
            <Input data-testid="recipientEmailAddress" type="email" {...register('recipientEmailAddress')} />
          </Box>

          <Box>
            <FormLabel variant="strong-label" size="md">
              {t('subject')}
            </FormLabel>
            <Input data-testid="message" disabled value="When Project Project ne..." {...register('message')} />
          </Box>
        </HStack>

        <Box mt="30px" w="445px">
          <FormLabel variant="strong-label" size="md">
            {t('body')}
          </FormLabel>
          <Textarea data-testid="body" fontSize={'14px'} placeholder="Write here..." {...register('body')} />
        </Box>

        <TextDivider title={t('textUser')} />

        <Box mt="30px" w="215px">
          <FormControl isInvalid={!!errors.recipientPhoneNumber}>
            <FormLabel variant="strong-label" size="md" whiteSpace="nowrap">
              {t('recipientPhoneNo')}
            </FormLabel>
            <Controller
              control={control}
              {...register(`recipientPhoneNumber`, {
                validate: (value: any) => {
                  var valid = true
                  if (phoneNumberRef.current && phoneNumberRef.current.value.replace(/\D+/g, '') !== '') {
                    if (phoneNumberRef.current.value.replace(/\D+/g, '').length !== 10) {
                      valid = false
                    }
                  }
                  return valid
                },
              })}
              render={({ field }) => {
                return (
                  <>
                    <NumberFormat
                      id="phoneNumber"
                      data-testid="recipientPhoneNumber"
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
          </FormControl>
        </Box>

        <Box mt="30px" w="445px">
          <FormLabel variant="strong-label" size="md">
            {t('body')}
          </FormLabel>
          <Textarea
            fontSize={'14px'}
            data-testid={'messageBody'}
            isDisabled
            bg="gray.200"
            w="445px"
            {...register('message')}
          />
        </Box>
      </Box>

      <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
        <Button onClick={onClose} data-testid={'cancelAlert'} variant="outline" colorScheme="brand">
          {t('cancel')}
        </Button>
        <Button type="submit" data-testid={'saveAlert'} form="alertDetails" isDisabled={!isEnabled} colorScheme="brand">
          {t('save')}
        </Button>
      </HStack>
    </Box>
  )
}
