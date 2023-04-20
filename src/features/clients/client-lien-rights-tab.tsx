import { Box, Flex, Button, Input, FormLabel, FormControl, VStack, HStack, FormErrorMessage } from '@chakra-ui/react'
import React from 'react'
import NumberFormat from 'react-number-format'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ClientFormValues } from 'types/client.type'
import { CLIENTS } from './clients.i18n'
import { CustomRequiredInput } from 'components/input/input'

type clientDetailProps = {
  clientDetails?: any
  onClose: () => void
  setNextTab: () => void
  markets?: any
}

export const LienRights = React.forwardRef((props: clientDetailProps) => {
  const { t } = useTranslation()

  const { isProjectCoordinator } = useUserRolesSelector()
  const { control } = useFormContext<ClientFormValues>()
  const markets = useWatch({ control, name: 'markets' })
  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }
  console.log(markets?.filter(m => m.checked))
  return (
    <>
      <Box h="400px" overflow="auto">
        <VStack alignItems={'flex-start'}>
          {markets?.map((market, index) => {
            return (
              <>
                {market?.checked ? (
                  <HStack>
                    <FormControl w={'215px'}>
                      <FormLabel variant="strong-label" size="md">
                        {t(`market`)}
                      </FormLabel>
                      <Input
                        id="market"
                        variant={'required-field'}
                        type="text"
                        disabled={true}
                        value={market?.metropolitanServiceArea}
                      />
                    </FormControl>
                    <FormControl w={'215px'}>
                      <FormLabel variant="strong-label" size="md">
                        {t(`${CLIENTS}.lienDueIn`)}
                      </FormLabel>
                      <Controller
                        control={control}
                        name={`markets.${index}.lienDueIn`}
                        rules={{ required: 'This is required field' }}
                        render={({ field: { name, onChange, value }, fieldState }) => {
                          return (
                            <>
                              <NumberFormat
                                name={name}
                                key={name}
                                data-testid={'lienDueIn-' + index}
                                value={value}
                                defaultValue={30}
                                onValueChange={values => {
                                  const { floatValue } = values
                                  onChange(floatValue)
                                }}
                                allowNegative={false}
                                customInput={CustomRequiredInput}
                              />
                              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                            </>
                          )
                        }}
                      />
                    </FormControl>
                  </HStack>
                ) : (
                  <></>
                )}
              </>
            )
          })}
        </VStack>
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isProjectCoordinator ? 'outline' : 'solid'} colorScheme="brand" onClick={props?.onClose}>
          {t(`${CLIENTS}.cancel`)}
        </Button>
        {!isProjectCoordinator && (
          <Button colorScheme="brand" type="submit" form="clientDetails" ml={2}>
            {t(`${CLIENTS}.save`)}
          </Button>
        )}
      </Flex>
    </>
  )
})
