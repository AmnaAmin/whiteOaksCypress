import {
  Box,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Checkbox,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStates } from 'utils/pc-projects'

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
}

export const Details = React.forwardRef((props: clientDetailProps) => {
  const { t } = useTranslation()
  // const { data: markets } = useMarkets()
  const { data: statesData } = useStates()

  // To get Contact Market

  // const clientSelectedMarket = parseInt(props?.clientDetails?.contacts?.map(m => m?.market))
  // const clientMarketArr = markets?.find(market => {
  //   if (market?.id === clientSelectedMarket) return { markets }
  //   return markets
  // })
  // const clientMarket = { label: clientMarketArr?.stateName, value: clientMarketArr?.id }

  // To get Client State
  const clientState = statesData?.map(state => {
    if (state?.id === props?.clientDetails?.state) return { label: state?.name, value: state?.id }
  }) 

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
  }

  const textStyle = {
    color: '#2D3748',
  }

  return (
    <Box>
      <Box overflow={'auto'} height={400}>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('name')}
              </FormLabel>
              <Input
                width="215px"
                variant="required-field"
                style={textStyle}
                value={props?.clientDetails?.companyName}
                isDisabled
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('paymentTerms')}
              </FormLabel>
              <Input
                width="215px"
                variant="required-field"
                style={textStyle}
                value={props?.clientDetails?.paymentTerm}
                isDisabled
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('paymentMethod')}
              </FormLabel>
              <Flex dir="row">
                <Checkbox
                  variant="required-field"
                  pr={1}
                  mt={4}
                  isChecked={props?.clientDetails?.paymentCreditCard}
                  style={textStyle}
                  isDisabled
                >
                  {t('creditCard')}
                </Checkbox>
                <Checkbox
                  variant="required-field"
                  pr={1}
                  mt={4}
                  isChecked={props?.clientDetails?.paymentCheck}
                  style={textStyle}
                  isDisabled
                >
                  {t('check')}
                </Checkbox>
                <Checkbox
                  variant="required-field"
                  mt={4}
                  isChecked={props?.clientDetails?.paymentACH}
                  style={textStyle}
                  isDisabled
                >
                  {t('ach')}
                </Checkbox>
              </Flex>
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl height="40px">
              <FormLabel variant="strong-label" size="md">
                {t('address')}
              </FormLabel>
              <Input
                variant="required-field"
                style={textStyle}
                value={props?.clientDetails?.streetAddress}
                isDisabled
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('city')}
              </FormLabel>
              <Input variant="required-field" style={textStyle} value={props?.clientDetails?.city} isDisabled />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('state')}
              </FormLabel>
              <ReactSelect options={clientState} value={clientState} selectProps={{ isBorderLeft: true }} isDisabled />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel variant="strong-label" size="md">
                {t('zipCode')}
              </FormLabel>
              <Input variant="required-field" style={textStyle} value={props?.clientDetails?.zipCode} isDisabled />
            </FormControl>
          </GridItem>
        </Grid>
        {props.clientDetails?.contacts.map(contact => {
          return (
            <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
              <GridItem>
                <FormControl height="40px">
                  <FormLabel variant="strong-label" size="md">
                    {t('contact')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={contact?.contact} isDisabled />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('phoneNo')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={contact?.phoneNumber} isDisabled />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('email')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={contact?.emailAddress} isDisabled />
                </FormControl>
              </GridItem>
              {/* <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('market')}
                  </FormLabel>
                  <ReactSelect
                    option={clientMarket} 
                    value={clientMarket}
                    selectProps={{ isBorderLeft: true }}
                    isDisabled
                  />
                </FormControl>
              </GridItem> */}
            </Grid>
          )
        })}
        <Flex alignItems="center" py="3">
          <Text fontSize="16px" color="gray.600" fontWeight={500} w={'370px'}>
            {t('accPayConInfo')}
          </Text>
          <Divider border="1px solid #E2E8F0" mt={1} />
        </Flex>
        {props.clientDetails?.accountPayableContactInfos.map(accPayConInfo => {
          return (
            <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="4">
              <GridItem>
                <FormControl height="40px">
                  <FormLabel variant="strong-label" size="md">
                    {t('contact')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={accPayConInfo?.contact} isDisabled />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('phoneNo')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={accPayConInfo?.phoneNumber} isDisabled />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('city')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={props?.clientDetails?.city} isDisabled />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="strong-label" size="md">
                    {t('comment')}
                  </FormLabel>
                  <Input variant="required-field" style={textStyle} value={accPayConInfo?.comments} isDisabled />
                </FormControl>
              </GridItem>
            </Grid>
          )
        })}
      </Box>
      <Flex style={btnStyle} py="4" pt={5}>
        <Button colorScheme="brand" onClick={props?.onClose}>
          {t('cancel')}
        </Button>
      </Flex>
    </Box>
  )
})

export default Details
