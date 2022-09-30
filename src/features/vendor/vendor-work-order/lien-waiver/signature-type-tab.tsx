import { Button, Divider, FormControl, HStack, ModalFooter, Stack, VStack } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useTranslation } from 'react-i18next'

export const SignatureTab = props => {
  const { onClose, setSignature } = props
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({})

  const onSubmit = useCallback(
    values => {
      setSignature(values.signature)
      onClose()
    },
    [onClose, setSignature],
  )

  return (
    <Stack>
      <form className="lienWaver" id="signatureForm" onSubmit={handleSubmit(onSubmit)}>
        <FormControl w="100%">
          <Stack align="center" spacing="30px">
            <VStack alignItems="start">
              <HStack>
                <FormInput
                  testId="signature-input"
                  errorMessage={errors.signature && errors.signature?.message}
                  label={t('typeName')}
                  labelStyle={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'gray.600',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  placeholder=""
                  register={register}
                  controlStyle={{ w: '600px' }}
                  elementStyle={{
                    // bg: 'gray.100',
                    h: '80px',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'gray.800',
                    border: '1px solid #E2E8F0',
                    px: '2em',
                    marginBottom: '6',
                  }}
                  rules={{ required: 'This is required field' }}
                  name={`signature`}
                />
              </HStack>
            </VStack>
          </Stack>
        </FormControl>
        <Divider />
        <ModalFooter mt={6}>
          <HStack spacing="16px">
            <Button variant="outline" colorScheme="brand" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button data-testid="save-signature" colorScheme="brand" type="submit" onClick={handleSubmit(onSubmit)}>
              {t('apply')}
            </Button>
          </HStack>
        </ModalFooter>
      </form>
    </Stack>
  )
}
