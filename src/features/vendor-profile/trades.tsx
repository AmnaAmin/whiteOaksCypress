import { Box, Button, Flex } from '@chakra-ui/react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'
import { validateTrade } from 'pages/vendor/vendor-profile'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Trade, VendorProfile, VendorTradeFormValues } from 'types/vendor.types'
import { useTrades } from 'api/vendor-details'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

type tradesFormProps = {
  vendorProfileData: VendorProfile
  onClose?: () => void
  trades?: Array<Trade>
  isActive: boolean
}

export const TradeList: React.FC<{ vendorProfileData: VendorProfile; onClose?: () => void; isActive: boolean }> = ({
  vendorProfileData,
  onClose,
  isActive,
}) => {
  const { data: trades, isLoading } = useTrades()

  return (
    <Box>
      {isLoading ? (
        <BlankSlate />
      ) : (
        <TradeForm isActive={isActive} vendorProfileData={vendorProfileData} trades={trades} onClose={onClose} />
      )}
    </Box>
  )
}

export const TradeForm = ({ vendorProfileData, trades, onClose, isActive }: tradesFormProps) => {
  const { control } = useFormContext<VendorTradeFormValues>()
  const { isFPM } = useUserRolesSelector()
  const tradeCheckboxes = useWatch({ control, name: 'trades' })

  return (
    <>
      <Box h="1000px" overflow="auto">
        <Flex id="Vendor_Trades" maxW="900px" wrap="wrap" gridGap={3}>
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
                      isDisabled={isFPM}
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
      <Flex
        alignItems="center"
        w="100%"
        height="72px"
        pt="10px"
        justifyContent="end"
        borderTop="2px solid #CBD5E0"
        mt={2}
      >
        {onClose && (
          <Button variant={isFPM ? 'solid' : 'outline'} colorScheme="darkPrimary" onClick={onClose} mr="3">
            Cancel
          </Button>
        )}
        {!isFPM && (
          <Button
            disabled={!validateTrade(tradeCheckboxes) || isFPM}
            type="submit"
            variant="solid"
            colorScheme="darkPrimary"
            data-testid="saveVendorSkills"
          >
            {vendorProfileData?.id ? t('save') : t('next')}
          </Button>
        )}
      </Flex>
    </>
  )
}
