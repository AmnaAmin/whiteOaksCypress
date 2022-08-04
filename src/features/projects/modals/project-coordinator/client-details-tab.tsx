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

type clientDetailProps = {
  clientDetails?: any
  onClose?: () => void
}

export const Details = React.forwardRef((props: clientDetailProps) => {
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
              Name
            </FormLabel>
            <Input width="215px" variant="required-field" value={props?.clientDetails?.companyName} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Payment Terms
            </FormLabel>
            <Input width="215px" variant="required-field" value={props?.clientDetails?.paymentTerm} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Payment Method
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
                Credit Card
              </Checkbox>
              <Checkbox
                variant="required-field"
                readOnly
                pr={1}
                mt={4}
                isChecked={props?.clientDetails?.paymentCheck}
                isDisabled
              >
                Check
              </Checkbox>
              <Checkbox
                variant="required-field"
                readOnly
                mt={4}
                isChecked={props?.clientDetails?.paymentACH}
                isDisabled
              >
                ACH
              </Checkbox>
            </Flex>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl height="40px">
            <FormLabel variant="strong-label" size="md">
              Address
            </FormLabel>
            <Input variant="required-field" value={props?.clientDetails?.streetAddress} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              City
            </FormLabel>
            <Input variant="required-field" value={props?.clientDetails?.city} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              State
            </FormLabel>
            <ReactSelect options={state} value={state} selectProps={{ isBorderLeft: true }} isDisabled />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Zip Code
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
                  Contact
                </FormLabel>
                <Input variant="required-field" value={contact?.contact} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Phone No
                </FormLabel>
                <Input variant="required-field" value={contact?.phoneNumber} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Email
                </FormLabel>
                <Input variant="required-field" value={contact?.emailAddress} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Market
                </FormLabel>
                <ReactSelect options={market} value={market} selectProps={{ isBorderLeft: true }} isDisabled />
              </FormControl>
            </GridItem>
          </Grid>
        )
      })}
      <Flex alignItems="center" py="3">
        <Text fontSize="16px" color="gray.600" fontWeight={500} w={'320px'}>
          Accounts Payable contact details
        </Text>
        <Divider border="1px solid #E2E8F0" />
      </Flex>
      {props.clientDetails?.accountPayableContactInfos.map(accPayConInfo => {
        return (
          <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="4">
            <GridItem>
              <FormControl height="40px">
                <FormLabel variant="strong-label" size="md">
                  Contact
                </FormLabel>
                <Input variant="required-field" value={accPayConInfo?.contact} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Phone No
                </FormLabel>
                <Input variant="required-field" value={accPayConInfo?.phoneNumber} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  City
                </FormLabel>
                <Input variant="required-field" value={props?.clientDetails?.city} isDisabled />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Comment
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
          Cancel
        </Button>
      </Flex>
    </Box>
  )
})

export default Details
