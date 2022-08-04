import { Box, Button, Flex } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Trade, VendorProfile, VendorTradeFormValues } from 'types/vendor.types'
import { useTrades } from 'utils/vendor-details'

type tradesFormProps = {
  vendorProfileData: VendorProfile
  onClose?: () => void
  trades?: Array<Trade>
}

export const TradeList: React.FC<{ vendorProfileData: VendorProfile; onClose?: () => void }> = ({
  vendorProfileData,
  onClose,
}) => {
  const { data: trades, isLoading } = useTrades()

  return (
    <Box>
      {isLoading ? (
        <BlankSlate />
      ) : (
        <TradeForm vendorProfileData={vendorProfileData} trades={trades} onClose={onClose} />
      )}
    </Box>
  )
}

export const TradeForm = ({ vendorProfileData, trades, onClose }: tradesFormProps) => {
  const { control } = useFormContext<VendorTradeFormValues>()

  const tradeCheckboxes = useWatch({ control, name: 'trades' })
  return (
    <>
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
  )
}
