import React, { useEffect } from 'react'
import { Box, Button, Flex, useToast } from '@chakra-ui/react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { VendorProfile, VendorProfilePayload, VendorTradeFormValues } from 'types/vendor.types'
import {
  parseTradeAPIDataToFormValues,
  parseTradeFormValuesToAPIPayload,
  useTrades,
  useVendorProfileUpdateMutation,
} from 'utils/vendor-details'
import { CheckboxButton } from 'components/form/checkbox-button'
// import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
// import 'components/translation/i18n';

export const TradeList: React.FC<{ vendorProfileData: VendorProfile }> = ({ vendorProfileData }) => {
  const toast = useToast()
  const { data: trades, isLoading } = useTrades()
  const { mutate: updateVendorProfile } = useVendorProfileUpdateMutation()

  const onSubmit = (formValues: VendorTradeFormValues) => {
    const vendorProfilePayload: VendorProfilePayload = parseTradeFormValuesToAPIPayload(formValues, vendorProfileData)

    updateVendorProfile(vendorProfilePayload, {
      onSuccess() {
        toast({
          title: 'Update Vendor Profile Trades',
          description: 'Vendor profile trades has been saved successfully.',
          status: 'success',
          isClosable: true,
        })
      },
    })
  }

  return (
    <Box>
      {isLoading ? (
        <BlankSlate />
      ) : (
        <TradeForm submitForm={onSubmit} vendorProfileData={vendorProfileData} trades={trades} />
      )}
    </Box>
  )
}

export const TradeForm = ({ submitForm, vendorProfileData, trades }) => {
  // const { t } = useTranslation()

  const {
    handleSubmit,
    control,
    reset,
    // formState: { errors }
  } = useForm<VendorTradeFormValues>({
    defaultValues: {
      trades: [],
    },
  })

  const { fields: tradeCheckboxes } = useFieldArray({
    control,
    name: 'trades',
  })

  useEffect(() => {
    if (trades?.length) {
      const tradeFormValues = parseTradeAPIDataToFormValues(trades, vendorProfileData)

      reset(tradeFormValues)
    }
  }, [trades, vendorProfileData, reset])

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Box h="65vh" mt={14}>
        <Flex maxW="900px" wrap="wrap" gridGap={3}>
          {tradeCheckboxes.map((checkbox, index) => {
            return (
              <Controller
                name={`trades.${index}`}
                control={control}
                key={checkbox.id}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <CheckboxButton
                      name={name}
                      key={name}
                      isChecked={value.checked}
                      data-testid={`tradeChecks.${value.id}`}
                      onChange={event => {
                        const checked = event.target.checked
                        onChange({ ...checkbox, checked })
                      }}
                    >
                      {value.skill}
                    </CheckboxButton>
                  )
                }}
              />
            )
          })}
        </Flex>
      </Box>
      <Flex borderTop="2px solid #E2E8F0" textAlign="end" w="100%" h="130px" justifyContent="end">
        <Button
          mt="16px"
          mr="60px"
          type="submit"
          colorScheme="CustomPrimaryColor"
          size="md"
          fontWeight={500}
          fontStyle="normal"
          fontSize="14px"
          data-testid="saveVendorSkills"
        >
          {/* {t('save')} */}
          Next
        </Button>
      </Flex>
    </form>
  )
}
