import { Box, Flex, Button } from '@chakra-ui/react'
import React from 'react'
import { CheckboxButton } from 'components/form/checkbox-button'
import { useMarkets } from 'utils/pc-projects'

type clientDetailProps = {
  clientDetails?: any
  onClose: () => void
  markets?: any
}

export const Market = React.forwardRef((props: clientDetailProps) => {
  const { data: markets } = useMarkets()

  const clientMarket = props?.clientDetails?.markets
    ? props?.clientDetails?.markets?.map(market => ({
        label: market?.metropolitanServiceArea,
        value: market?.id,
      }))
    : null

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
            // clientMarket?.map(cm => {
            //   if (m?.metropolitanServiceArea === cm?.label){
            //      return <CheckboxButton isChecked>{cm?.label}</CheckboxButton>
            //  }
            // })
            return <CheckboxButton>{m?.metropolitanServiceArea}</CheckboxButton>
          })}

          {/* {clientMarket?.map(cm => {
                  return <CheckboxButton isChecked>{cm?.label}</CheckboxButton>
            })} */}
        </Flex>
      </Box>
      <Flex style={btnStyle} py={4} pt={5}>
        <Button colorScheme="brand" onClick={props.onClose}>
          Cancel
        </Button>
      </Flex>
    </>
  )
})
