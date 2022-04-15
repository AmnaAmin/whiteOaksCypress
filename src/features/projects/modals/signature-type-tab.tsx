import { Box, Button, Divider, FormControl, HStack, ModalFooter, Stack, VStack } from '@chakra-ui/react'
import { t } from 'i18next'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from 'components/react-hook-form-fields/input'

export const SignatureTab = props => {
  const { onClose, setSignature } = props
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
          <VStack align="center" spacing="30px">
            <Box>
              <VStack alignItems="start">
                <HStack>
                  <FormInput
                    errorMessage={errors.signature && errors.signature?.message}
                    label="Type Your Name Here"
                    labelStyle={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'gray.800',
                      marginBottom: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    placeholder=""
                    register={register}
                    controlStyle={{ w: '50em' }}
                    elementStyle={{
                      bg: 'gray.100',
                      h: '150px',
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
            </Box>
          </VStack>
        </FormControl>
        <Divider />
        <ModalFooter mt={3}>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="gray.700"
            fontStyle="normal"
            fontWeight={500}
            fontSize="14px"
          >
            {t('close')}
          </Button>
          <Button
            colorScheme="CustomPrimaryColor"
            mr={3}
            size="lg"
            type="submit"
            fontStyle="normal"
            fontWeight={500}
            fontSize="14px"
          >
            {t('apply')}
          </Button>
        </ModalFooter>
      </form>
    </Stack>
  )
}
