import { Box, Button, Flex } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import { validateMarket } from 'pages/vendor/vendor-profile'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Market, VendorMarketFormValues, VendorProfile } from 'types/vendor.types'
import { useMarkets } from 'api/vendor-details'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

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
  const { isFPM } = useUserRolesSelector()

  return (
    <>
      <Box h="584px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3}>
          {tradeCheckboxes?.map((checkbox, index) => {
            return (
              <Controller
                name={`markets.${index}`}
                control={control}
                key={checkbox.market.id}
                render={({ field: { name, onChange, value } }) => {
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
                      isDisabled={isFPM}
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
        borderTop="2px solid #CBD5E0"
        alignItems="center"
        height="72px"
        pt="8px"
        w="100%"
        justifyContent="end"
      >
        {onClose && (
          <Button variant={isFPM ? 'solid' : 'outline'} colorScheme="darkPrimary" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        {!isFPM && (
          <Button
            disabled={!validateMarket(tradeCheckboxes) || isFPM}
            type="submit"
            variant="solid"
            colorScheme="darkPrimary"
            data-testid="saveMarkets"
          >
            {t('save')}
          </Button>
        )}
      </Flex>
    </>
  )
}
