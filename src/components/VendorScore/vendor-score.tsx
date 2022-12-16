import React from 'react'
import {
  Text,
  Flex,
  Box,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Center,
  Spinner,
  VStack,
  Spacer,
} from '@chakra-ui/react'

import { Card } from '../card/card'
import { SimpleSlider } from './SimpleSlider'
import { useVendorCards, useVendorEntity } from 'api/vendor-dashboard'
import { useTranslation } from 'react-i18next'

import { LicenseDocument } from 'types/vendor.types'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import Status from 'features/common/status'
import numeral from 'numeral'
import { ExpirationAlertMessage } from '../../features/common/expiration-alert-message'
import { DASHBOARD } from 'features/vendor/dashboard/dashboard.i18n'

const LicenseType: { [key: number]: string } = {
  1: 'Electrical',
  2: 'Plumbing',
  3: 'General Contractor',
  4: 'Roofing',
  5: 'Architecture',
  6: 'Mechanical',
}

export const VendorScore: React.FC<{ vendorId: number }> = ({ vendorId }) => {
  const { data: vendorEntity, isLoading } = useVendorEntity(vendorId)
  const scoreProgress = ((vendorEntity?.score ?? 0) / 5) * 100
  const { t } = useTranslation()
  const { data: cards } = useVendorCards()
  const ammount = numeral(cards?.find(c => c.label === 'upcomingInvoiceTotal')?.count).format('($0,0.00)')

  const defaultData = [
    {
      title: 'COI WC',
      date: vendorEntity?.coiWcExpirationDate,
      testId: 'coi-wc-expiration-date',
    },
    {
      title: 'COI GL',
      date: vendorEntity?.coiglExpirationDate,
    },
    {
      title: t('agreementSigned'),
      date: vendorEntity?.agreementSignedDate,
    },
    {
      title: t('autoInsurance'),
      date: vendorEntity?.autoInsuranceExpirationDate,
    },
  ].filter(item => item.date)

  return (
    <Box>
      <ExpirationAlertMessage insurance={defaultData} license={vendorEntity?.licenseDocuments} />
      <Box
        justifyContent="space-evenly"
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr', xl: '1fr 2fr' }}
        alignItems="center"
      >
        <Card h={156} rounded="6px">
          <Flex h="99%" w="100%">
            <HStack w="100%" spacing="0">
              <VStack spacing="3px" alignItems="start" w="100%">
                <HStack spacing="-3" h="100%" alignItems="end" w="100%">
                  <CircularProgress color="#68D391" capIsRound value={scoreProgress} size="95px">
                    <CircularProgressLabel h="57%">
                      {isLoading ? (
                        <Center>
                          <Spinner size="xl" />
                        </Center>
                      ) : (
                        <VStack spacing={-1}>
                          <Text fontSize="20px" fontWeight={500} color="gray.600" data-testid="vendor-score">
                            {vendorEntity?.score}
                          </Text>
                          <Text color="gray.500" fontWeight={400} fontSize="12px">
                            {t('outOf')} 5
                          </Text>
                        </VStack>
                      )}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <HStack>
                    <Box mb="20px" ml="30px">
                      {isLoading ? (
                        <BlankSlate width="200px" h="20px" />
                      ) : (
                        <Text fontSize="20px" color="gray.700" fontWeight={700}>
                          {ammount}
                        </Text>
                      )}
                      <Text fontSize="16px" color="gray.700" fontWeight={400} whiteSpace="nowrap">
                        {t('upcomingPayment')}
                      </Text>
                    </Box>
                  </HStack>
                </HStack>
                <Text
                  textAlign="center"
                  fontSize="12px"
                  fontWeight={400}
                  color="gray.500"
                  fontStyle="normal"
                  whiteSpace="nowrap"
                  pl="12px"
                >
                  {t(`${DASHBOARD}.vendorscore`)}
                </Text>
              </VStack>
              <Spacer />
              <VStack justifyContent="space-between" h="100%" alignItems="end">
                {isLoading ? (
                  <BlankSlate width="60px" h="15px" />
                ) : (
                  <Status value={vendorEntity?.statusLabel} id={vendorEntity?.statusLabel} />
                )}
              </VStack>
            </HStack>
          </Flex>
        </Card>

        <Flex
          pt={{ base: '15px', xl: '0' }}
          pl={{ base: '0px', xl: '15px' }}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px,1fr))"
          gridGap="15px"
        >
          <SimpleSlider
            heading={t('insuranceExpiration')}
            data={defaultData.sort((curr: any, pre: any) => (curr.date > pre.date ? 1 : -1))}
            isLoading={isLoading}
          />

          <SimpleSlider
            isLoading={isLoading}
            heading={t('licenseExpiration')}
            data={vendorEntity?.licenseDocuments
              .map((licenseDocument: LicenseDocument) => ({
                title: LicenseType[licenseDocument.licenseType],
                date: licenseDocument.licenseExpirationDate,
                testId: LicenseType[licenseDocument.licenseType],
              }))
              .sort((curr: any, pre: any) => (curr.date > pre.date ? 1 : -1))}
          />
        </Flex>
      </Box>
    </Box>
  )
}
