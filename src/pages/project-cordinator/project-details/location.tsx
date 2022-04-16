import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import React from 'react'

const Location = () => {
  return (
    <Box>
      <form>
        <Grid templateColumns="repeat(4,1fr)" rowGap={10} columnGap={5} w="70%">
          <GridItem>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input borderLeft="2px solid #4E87F8" />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input borderLeft="2px solid #4E87F8" />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Input borderLeft="2px solid #4E87F8" />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Zip</FormLabel>
              <Input />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Market</FormLabel>
              <Input borderLeft="2px solid #4E87F8" />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Gate Code</FormLabel>
              <Input />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Lock Box Code</FormLabel>
              <Input />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>HOA Contact Phone</FormLabel>
              <Input />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Ext</FormLabel>
              <Input />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>HOA Contact Email</FormLabel>
              <Input />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem></GridItem>
        </Grid>
      </form>
    </Box>
  )
}

export default Location
