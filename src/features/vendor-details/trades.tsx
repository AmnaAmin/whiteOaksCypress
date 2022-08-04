import React, { useEffect } from 'react'
import { Box, Button, Flex, useToast } from '@chakra-ui/react'
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { Trade, VendorProfile, VendorTradeFormValues } from 'types/vendor.types'
import {
  parseTradeAPIDataToFormValues,
  parseTradeFormValuesToAPIPayload,
  useTrades,
  useVendorProfileUpdateMutation,
} from 'utils/vendor-details'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import { useQueryClient } from 'react-query'

type tradesFormProps = {
  // submitForm: (values: any) => void
  vendorProfileData: VendorProfile
  onClose?: () => void
  trades?: Array<Trade>
}

export const TradeList: React.FC<{ vendorProfileData: VendorProfile; onClose?: () => void }> = ({
  vendorProfileData,
  onClose,
}) => {
  const toast = useToast()
  const { data: trades, isLoading } = useTrades()
  const { mutate: updateVendorProfile } = useVendorProfileUpdateMutation()
  const queryClient = useQueryClient()

  // const onSubmit = (formValues: VendorTradeFormValues) => {
  //   const vendorProfilePayload = parseTradeFormValuesToAPIPayload(formValues, vendorProfileData)
  //   updateVendorProfile(vendorProfilePayload, {
  //     onSuccess() {
  //       queryClient.invalidateQueries('vendorProfile')
  //       toast({
  //         title: t('updateTrades'),
  //         description: t('updateTradesSuccess'),
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
        <TradeForm
          // submitForm={onSubmit}
          vendorProfileData={vendorProfileData}
          trades={trades}
          onClose={onClose}
        />
      )}
    </Box>
  )
}

export const TradeForm = ({ vendorProfileData, trades, onClose }: tradesFormProps) => {
  // const { t } = useTranslation()

  const {
    //  handleSubmit,
    control,
  } = useFormContext<VendorTradeFormValues>()

  const tradeCheckboxes = useWatch({ control, name: 'trades' })

  // useEffect(() => {
  //   if (trades?.length) {
  //     const tradeFormValues = parseTradeAPIDataToFormValues(trades, vendorProfileData as VendorProfile)
  //     replace(tradeFormValues.trades)
  //   }
  // }, [trades, vendorProfileData, replace])

  return (
    <>
      {/* <form onSubmit={handleSubmit(submitForm)} id="trade"> */}
      <Box h="510px" overflow="auto">
        <Flex maxW="900px" wrap="wrap" gridGap={3}>
          {tradeCheckboxes?.map((checkbox, index) => {
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
                      data-testid={`tradeChecks.${value.trade.id}`}
                      onChange={event => {
                        const checked = event.target.checked
                        onChange({ ...checkbox, checked })
                      }}
                    >
                      {value.trade.skill}
                    </CheckboxButton>
                  )
                }}
              />
            )
          })}
        </Flex>
      </Box>
      <Flex alignItems="center" w="100%" height="72px" pt="8px" justifyContent="end" borderTop="2px solid #E2E8F0">
        {onClose && (
          <Button variant="outline" colorScheme="brand" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="solid" colorScheme="brand" data-testid="saveVendorSkills">
          {vendorProfileData?.id ? t('save') : t('next')}
        </Button>
      </Flex>
    </>
    // {/* </form> */}
  )
}
