import { Box, Flex, Button } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useMarkets } from 'api/pc-projects'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import { useForm, useFormContext } from 'react-hook-form'
import { ClientFormValues } from 'types/client.type'
import { useSaveNewClientDetails, useUpdateClientDetails } from 'api/clients'

type clientDetailProps = {
  clientDetails?: any
  onClose: () => void
  setNextTab: () => void
  markets?: any
}

export const Market = React.forwardRef((props: clientDetailProps) => {
  const { markets } = useMarkets()
  const { t } = useTranslation()
  const { isProjectCoordinator } = useUserRolesSelector()
  const { mutate: editClientDetails } = useUpdateClientDetails()
  const { mutate: addNewClientDetails } = useSaveNewClientDetails()

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }

  const formReturn = useForm<ClientFormValues>()
  const { register } = formReturn

  const onSubmit = useCallback(
    async values => {
      const queryOptions = {
        onSuccess() {},
      }
      if (values?.id) {
        const editMarketPayload = {
          ...values,
        }
        editClientDetails(editMarketPayload, queryOptions)
      } else {
        const newMarketPayload = {
          ...values,
        }
        console.log('newMarketPayload...', newMarketPayload)
        addNewClientDetails(newMarketPayload, queryOptions)
      }
    },
    [addNewClientDetails],
  )

  return (
    <>
      <Box h="400px" overflow="auto">
        <form onSubmit={formReturn.handleSubmit(onSubmit)} id="marketDetails">
          <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
            {markets?.map(m => {
              return (
                <CheckboxButton
                  {...register(m?.metropolitanServiceArea)}
                  isChecked={props?.clientDetails?.markets?.find(market => m?.id === market?.id)}
                  isDisabled={isProjectCoordinator}
                  onClick = {e => e.target}
                >
                  {m?.metropolitanServiceArea}
                </CheckboxButton>
              )
            })}
          </Flex>
        </form>
      </Box>
      <Flex style={btnStyle} py="4" pt={5} mt={4}>
        <Button variant={!isProjectCoordinator ? 'outline' : ''} colorScheme="brand" onClick={props?.onClose}>
          {t('cancel')}
        </Button>
        {!isProjectCoordinator && (
          <Button
            colorScheme="brand"
            type="submit"
            form="marketDetails" //onClick={props.setNextTab}
            ml={2}
          >
            {t('save')}
          </Button>
        )}
      </Flex>
    </>
  )
})
