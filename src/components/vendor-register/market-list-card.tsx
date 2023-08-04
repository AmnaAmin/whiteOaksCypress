import { Box, Flex } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Market, VendorMarketFormValues } from 'types/vendor.types'
import { useMarkets } from 'api/vendor-details'

type marketFormProps = {
  onClose?: () => void
  markets?: Array<Market>
  isActive: boolean
}

export const MarketListCard: React.FC<{ onClose?: () => void; isActive: boolean }> = ({ onClose, isActive }) => {
  const { markets, isLoading } = useMarkets()

  return (
    <Box>{isLoading ? <BlankSlate /> : <MarketForm isActive={isActive} markets={markets} onClose={onClose} />}</Box>
  )
}

export const MarketForm = ({ onClose, isActive, markets }: marketFormProps) => {
  const { control } = useFormContext<VendorMarketFormValues>()
  const tradeCheckboxes = useWatch({ control, name: 'markets' })

  return (
    <>
      <Box h="584px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3} position={'relative'}>
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
    </>
  )
}
