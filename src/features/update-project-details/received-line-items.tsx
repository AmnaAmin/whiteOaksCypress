import React from 'react'
import { Box, Flex, GridItem, Grid, VStack } from '@chakra-ui/react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InvoicingType } from 'types/invoice.types'
import { Project } from 'types/project.type'
import { dateFormat } from 'utils/date-time-utils'

type InvoiceItemsFormProps = {
  formReturn: UseFormReturn<InvoicingType>
  projectData?: Project | null
  invoice?: InvoicingType | undefined
}

export const ReceivedLineItems: React.FC<InvoiceItemsFormProps> = ({ formReturn, projectData, invoice }) => {
  const { t } = useTranslation()

  const { watch } = formReturn

  const watchInvoiceArray = watch('receivedLineItems')

  return (
    <Box overflowX={'auto'} w="100%">
      <VStack alignItems="start" w="720px">
        <Flex
          borderStyle="solid"
          borderColor="gray.300"
          borderWidth="1px 1px 1px 1px"
          flex="1"
          pos="relative"
          flexDirection="column"
          rounded={6}
          w="100%"
        >
          <Grid
            gridTemplateColumns={'1fr 2fr 1fr 1fr'}
            py="3"
            fontSize="14px"
            color="gray.600"
            bg="bgGlobal.50"
            gap="1rem"
            borderStyle="solid"
            borderColor="gray.300"
            roundedTop={6}
            textAlign={'center'}
          >
            <GridItem ml="10px"> {t(`project.projectDetails.type`)}</GridItem>
            <GridItem ml="10px"> {t(`project.projectDetails.description`)}</GridItem>
            <GridItem ml="10px">{t(`project.projectDetails.date`)}</GridItem>
            <GridItem ml="10px">{t(`project.projectDetails.amount`)}</GridItem>
          </Grid>

          <Box flex="1" overflow="auto" maxH="150px" minH="150px" textAlign={'center'} id="amounts-list">
            {watchInvoiceArray && watchInvoiceArray?.length > 0 ? (
              <>
                {watchInvoiceArray?.map((invoiceItem, index) => {
                  return (
                    <Grid
                      className="amount-input-row"
                      key={index}
                      gridTemplateColumns={'1fr 2fr 1fr 1fr'}
                      pt={'6px'}
                      pb="6px"
                      fontSize="14px"
                      color="gray.600"
                      gap="20px"
                      borderStyle="solid"
                      borderColor="gray.300"
                      height="auto"
                    >
                      <GridItem ml="10px">{invoiceItem.name}</GridItem>
                      <GridItem ml="10px">{invoiceItem.description}</GridItem>
                      <GridItem ml="10px">{dateFormat(invoiceItem.modifiedDate as string)}</GridItem>
                      <GridItem ml="10px">{invoiceItem.amount}</GridItem>
                    </Grid>
                  )
                })}
              </>
            ) : (
              <Box w="100%" mt="10px" mb="10px" textAlign="center" fontSize={'14px'} color="gray.500">
                {t('noDataDisplayed')}
              </Box>
            )}
          </Box>
        </Flex>
      </VStack>
    </Box>
  )
}
