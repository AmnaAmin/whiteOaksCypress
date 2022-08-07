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

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
}

export const Details = React.forwardRef((props: clientDetailProps) => {
  const { t } = useTranslation()

  const market = props?.clientDetails?.markets
    ? props?.clientDetails?.markets?.map(market => ({
        label: market?.metropolitanServiceArea,
        value: market?.id,
      }))
    : null

  const state = props?.clientDetails?.markets
    ? props?.clientDetails?.markets?.map(market => ({
        label: market?.state?.name,
        value: market?.state?.id,
      }))
    : null

  const btnStyle = {
    alignItems: 'center',
    justifyContent: 'end',
    borderTop: '1px solid #CBD5E0',
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
            <Input width="215px" variant="required-field" value={props?.clientDetails?.companyName} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t('paymentTerms')}
            </FormLabel>
            <Input width="215px" variant="required-field" value={props?.clientDetails?.paymentTerm} isDisabled />
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
                readOnly
                pr={1}
                mt={4}
                isChecked={props?.clientDetails?.paymentCreditCard}
                isDisabled
              >
               {t('creditCard')}
              </Checkbox>
              <Checkbox
                variant="required-field"
                readOnly
                pr={1}
                mt={4}
                isChecked={props?.clientDetails?.paymentCheck}
                isDisabled
              >
                {t('check')}
              </Checkbox>
              <Checkbox
                variant="required-field"
                readOnly
                mt={4}
                isChecked={props?.clientDetails?.paymentACH}
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
            <Input variant="required-field" value={props?.clientDetails?.streetAddress} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t('city')}
            </FormLabel>
            <Input variant="required-field" value={props?.clientDetails?.city} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t('state')}
            </FormLabel>
            <ReactSelect options={state} value={state} selectProps={{ isBorderLeft: true }} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              {t('zipCode')}
            </FormLabel>
            <Input variant="required-field" value={props?.clientDetails?.zipCode} isDisabled />
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
                <Input variant="required-field" value={contact?.contact} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('phoneNo')}
                </FormLabel>
                <Input variant="required-field" value={contact?.phoneNumber} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('email')}
                </FormLabel>
                <Input variant="required-field" value={contact?.emailAddress} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('market')}
                </FormLabel>
                <ReactSelect options={market} value={market} selectProps={{ isBorderLeft: true }} isDisabled />
              </FormControl>
            </GridItem>
          </Grid>
        )
      })}
      <Flex alignItems="center" py="3">
        <Text fontSize="16px" color="gray.600" fontWeight={500} w={'370px'}>
          {t('accPayConInfo')} 
        </Text>
        <Divider border="1px solid #E2E8F0" mt={1}/>
      </Flex>
      {props.clientDetails?.accountPayableContactInfos.map(accPayConInfo => {
        return (
          <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="4">
            <GridItem>
              <FormControl height="40px">
                <FormLabel variant="strong-label" size="md">
                  {t('contact')}
                </FormLabel>
                <Input variant="required-field" value={accPayConInfo?.contact} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('phoneNo')}
                </FormLabel>
                <Input variant="required-field" value={accPayConInfo?.phoneNumber} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('city')}
                </FormLabel>
                <Input variant="required-field" value={props?.clientDetails?.city} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  {t('comment')}
                </FormLabel>
                <Input variant="required-field" value={accPayConInfo?.comments} isDisabled />
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
