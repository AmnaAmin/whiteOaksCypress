import { Box, Flex, Button } from '@chakra-ui/react'
import React from 'react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useMarkets } from 'api/pc-projects'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'

type clientDetailProps = {
  clientDetails?: any
  onClose: () => void
  markets?: any
}

export const Market = React.forwardRef((props: clientDetailProps) => {
  const { markets } = useMarkets()
  const { t } = useTranslation()
  const { isProjectCoordinator } = useUserRolesSelector()

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }

  return (
    <>
      <Box h="400px" overflow="auto">
        <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
          {markets?.map(m => {
            return (
              <CheckboxButton
                isChecked={props?.clientDetails?.markets?.find(market => m?.id === market?.id)}
                isDisabled = {isProjectCoordinator}
              >
                {m?.metropolitanServiceArea}
              </CheckboxButton>
            )
          })}
        </Flex>
      </Box>
      <Flex style={btnStyle} py={4} pt={5}>
        <Button colorScheme="brand" onClick={props.onClose}>
          {t('cancel')}
        </Button>
      </Flex>
    </>
  )
})
