import React, { useEffect } from 'react'
import { Box, Button, Flex, useToast } from '@chakra-ui/react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { VendorMarketFormValues, VendorProfile, VendorProfilePayload } from 'types/vendor.types'
import {
  parseMarketAPIDataToFormValues,
  parseMarketFormValuesToAPIPayload,
  useMarkets,
  useVendorProfileUpdateMutation,
} from 'utils/vendor-details'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useTranslation } from 'react-i18next'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
// import 'components/translation/i18n';

export const MarketList: React.FC<{ vendorProfileData: VendorProfile }> = ({ vendorProfileData }) => {
  const toast = useToast()
  const { markets, isLoading } = useMarkets()
  const { mutate: updateVendorProfile } = useVendorProfileUpdateMutation()

  const onSubmit = (formValues: VendorMarketFormValues) => {
    const vendorProfilePayload: VendorProfilePayload = parseMarketFormValuesToAPIPayload(formValues, vendorProfileData)

    updateVendorProfile(vendorProfilePayload, {
      onSuccess() {
        toast({
          title: 'Update Vendor Profile Markets',
          description: 'Vendor profile markets has been saved successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
      },
    })
  }

  return (
    <Box>
      {isLoading ? (
        <BlankSlate />
      ) : (
        <MarketForm submitForm={onSubmit} vendorProfileData={vendorProfileData} markets={markets} />
      )}
    </Box>
  )
}

export const MarketForm = ({ submitForm, vendorProfileData, markets }) => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    control,
    reset,
    // formState: { errors }
  } = useForm<VendorMarketFormValues>({
    defaultValues: {
      markets: [],
    },
  })

  const { fields: tradeCheckboxes } = useFieldArray({
    control,
    name: 'markets',
  })

  useEffect(() => {
    if (markets?.length && vendorProfileData) {
      const tradeFormValues = parseMarketAPIDataToFormValues(markets, vendorProfileData)

      reset(tradeFormValues)
    }
  }, [markets, vendorProfileData, reset])

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Box h="65vh">
        <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
          {tradeCheckboxes.map((checkbox, index) => {
            return (
              <Controller
                name={`markets.${index}`}
                control={control}
                key={checkbox.id}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <CheckboxButton
                      name={name}
                      key={name}
                      isChecked={value.checked}
                      data-testid={`marketChecks.${value.id}`}
                      onChange={event => {
                        const checked = event.target.checked
                        onChange({ ...checkbox, checked })
                      }}
                    >
                      {value.metropolitanServiceArea}
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
          fontWeight={600}
          fontStyle="normal"
          fontSize="14px"
          data-testid="saveMarkets"
        >
          {t('save')}
        </Button>
      </Flex>
    </form>
  )
}
