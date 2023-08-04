/*eslint-disable */
import { Box, Button, Flex } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import { validateTrade } from 'pages/vendor/vendor-profile'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Trade, VendorProfile, VendorTradeFormValues } from 'types/vendor.types'
import { useTrades } from 'api/vendor-details'

type tradesFormProps = {
  onClose?: () => void
  trades?: Array<Trade>
  isActive: boolean
}

export const ConstructionTradeCard: React.FC<{ onClose?: () => void; isActive: boolean }> = ({ onClose, isActive }) => {
  const { data: trades, isLoading } = useTrades()

  return <Box>{isLoading ? <BlankSlate /> : <TradeForm isActive={isActive} trades={trades} onClose={onClose} />}</Box>
}

export const TradeForm = ({ trades, onClose, isActive }: tradesFormProps) => {
  const { control } = useFormContext<VendorTradeFormValues>()

  const tradeCheckboxes = useWatch({ control, name: 'trades' })
  return (
    <>
      <Box h="584px" overflow="auto">
        <Flex maxW="900px" wrap="wrap" gridGap={3} position={'relative'}>
          {tradeCheckboxes?.map((checkbox, index) => {
            return (
              <Controller
                name={`trades.${index}`}
                control={control}
                key={checkbox.trade.id}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <CheckboxButton
                      name={name}
                      key={value.trade.id}
                      isChecked={checkbox.checked}
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
    </>
  )
}
