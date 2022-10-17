import { Box, Flex, Button } from '@chakra-ui/react'
import React from 'react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useMarkets } from 'api/pc-projects'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ClientFormValues } from 'types/client.type'

type clientDetailProps = {
  clientDetails?: any
  onClose: () => void
  setNextTab: () => void
  markets?: any
}

export const Market = React.forwardRef((props: clientDetailProps) => {
  const { t } = useTranslation()
  const { isProjectCoordinator } = useUserRolesSelector()
  const { control } = useFormContext<ClientFormValues>()
  const selectedMarkets = useWatch({ control, name: 'markets' })
  const { markets } = useMarkets()

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }

  return (
    <>
      <Box h="400px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
          {markets?.map((market, index) => {
            return (
              <Controller
                name={`markets.${index}`}
                control={control}
                key={market.id}
                render={({ field: { name, onChange } }) => {
                  return (
                    <CheckboxButton
                      name={name}
                      key={name}
                      isChecked={!!selectedMarkets?.find(m => m?.id === market.id)}
                      onChange={event => {
                        const checked = event.target.checked
                        onChange({ ...market, id: checked ? market.id : null })
                      }}
                      isDisabled={isProjectCoordinator}
                    >
                      {market.metropolitanServiceArea}
                    </CheckboxButton>
                  )
                }}
              />
            )
          })}
        </Flex>
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isProjectCoordinator ? 'outline' : 'solid'} colorScheme="brand" onClick={props?.onClose}>
          {t('cancel')}
        </Button>
        {!isProjectCoordinator && (
          <Button
            colorScheme="brand"
            type="submit"
            form="clientDetails" 
            ml={2}
          >
            {t('save')}
          </Button>
        )}
      </Flex>
    </>
  )
})
