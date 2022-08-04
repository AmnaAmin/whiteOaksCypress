import React, { useEffect } from 'react'
import { Box, Button, Flex, useToast } from '@chakra-ui/react'
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { Market, VendorMarketFormValues, VendorProfile, VendorProfilePayload } from 'types/vendor.types'
import {
  parseMarketAPIDataToFormValues,
  parseMarketFormValuesToAPIPayload,
  useMarkets,
  useVendorProfileUpdateMutation,
} from 'utils/vendor-details'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import { useQueryClient } from 'react-query'
// import 'components/translation/i18n';

type marketFormProps = {
  // submitForm: (values: any) => void
  onClose?: () => void
  vendorProfileData: VendorProfile
  markets?: Array<Market>
}

export const MarketList: React.FC<{ vendorProfileData: VendorProfile; onClose?: () => void }> = ({
  vendorProfileData,
  onClose,
}) => {
  const toast = useToast()
  const { markets, isLoading } = useMarkets()
  // const { mutate: updateVendorProfile } = useVendorProfileUpdateMutation()
  // const queryClient = useQueryClient()

  // const onSubmit = (formValues: VendorMarketFormValues) => {
  //   const vendorProfilePayload: Partial<VendorProfilePayload> = parseMarketFormValuesToAPIPayload(
  //     formValues,
  //     vendorProfileData,
  //   )

  //   updateVendorProfile(vendorProfilePayload, {
  //     onSuccess() {
  //       queryClient.invalidateQueries('vendorProfile')
  //       onClose?.()
  //       toast({
  //         title: t('updateMarkets'),
  //         description: t('updateMarketsSuccess'),
  //         status: 'success',
  //         isClosable: true,
  //       })
  //     },
  //   })
  // }

  return (
    <Box>
      {isLoading ? (
        <BlankSlate />
      ) : (
        <MarketForm
          // submitForm={onSubmit}
          vendorProfileData={vendorProfileData}
          markets={markets}
          onClose={onClose}
        />
      )}
    </Box>
  )
}

export const MarketForm = ({
  // submitForm,
  vendorProfileData,
  markets,
  onClose,
}: marketFormProps) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    // formState: { errors }
  } = useFormContext<VendorMarketFormValues>()
  //   {
  //   defaultValues: {
  //     markets: [],
  //   },
  // }

  // const { fields: tradeCheckboxes } = useFieldArray({
  //   control,
  //   name: 'markets',
  // })
  const tradeCheckboxes = useWatch({ control, name: 'markets' })
  // useEffect(() => {
  //   if (markets?.length && vendorProfileData) {
  //     const tradeFormValues = parseMarketAPIDataToFormValues(markets, vendorProfileData as VendorProfile)
  //     setValue('markets', tradeFormValues.markets)
  //   }
  // }, [markets, vendorProfileData, setValue])
  return (
    // <form onSubmit={handleSubmit(submitForm)} id="market">
    <>
      <Box h="502px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3}>
          {tradeCheckboxes?.map((checkbox, index) => {
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
                      data-testid={`marketChecks.${value.market?.id}`}
                      onChange={event => {
                        const checked = event.target.checked
                        onChange({ ...checkbox, checked })
                      }}
                    >
                      {value.market?.metropolitanServiceArea}
                    </CheckboxButton>
                  )
                }}
              />
            )
          })}
        </Flex>
      </Box>
      <Flex
        mt={2}
        borderTop="2px solid #E2E8F0"
        alignItems="center"
        height="72px"
        pt="8px"
        w="100%"
        justifyContent="end"
      >
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}

        <Button type="submit" variant="solid" colorScheme="brand" data-testid="saveMarkets">
          {t('save')}
        </Button>
      </Flex>
    </>
    // </form>
  )
}
