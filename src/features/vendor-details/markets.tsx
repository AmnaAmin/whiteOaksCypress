import { Box, Button, Flex } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import { validateMarket } from 'pages/vendor/vendor-profile'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Market, VendorMarketFormValues, VendorProfile } from 'types/vendor.types'
import { useMarkets } from 'utils/vendor-details'

type marketFormProps = {
  onClose?: () => void
  vendorProfileData: VendorProfile
  markets?: Array<Market>
  isActive: boolean
}

export const MarketList: React.FC<{ vendorProfileData: VendorProfile; onClose?: () => void; isActive: boolean }> = ({
  vendorProfileData,
  onClose,
  isActive,
}) => {
  const { markets, isLoading } = useMarkets()

  return (
    <Box>
      {isLoading ? (
        <BlankSlate />
      ) : (
        <MarketForm isActive={isActive} vendorProfileData={vendorProfileData} markets={markets} onClose={onClose} />
      )}
    </Box>
  )
}

export const MarketForm = ({ onClose, isActive }: marketFormProps) => {
  const { control } = useFormContext<VendorMarketFormValues>()
  const tradeCheckboxes = useWatch({ control, name: 'markets' })

  return (
    <>
      <Box h="502px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3}>
          {tradeCheckboxes?.map((checkbox, index) => {
            console.log('checkbox', checkbox, index)
            return (
              <Controller
                name={`markets.${index}`}
                control={control}
                key={checkbox.market.id}
                render={({ field: { name, onChange, value } }) => {
                  console.log('value.checked', value.checked, name)
                  return (
                    <CheckboxButton
                      name={name}
                      key={value.market.id}
                      isChecked={checkbox.checked}
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

        <Button
          disabled={!validateMarket(tradeCheckboxes)}
          type="submit"
          variant="solid"
          colorScheme="brand"
          data-testid="saveMarkets"
        >
          {t('save')}
        </Button>
      </Flex>
    </>
  )
}
