import React from 'react'
import { VStack, Text, Flex, Box, Progress } from '@chakra-ui/react'

import { Card } from '../card/card'
import { SimpleSlider } from './SimpleSlider'
import { useVendorEntity } from 'utils/vendor-dashboard'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { LicenseDocument } from 'types/vendor.types'
import { dateFormat } from 'utils/date-time-utils'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import Status from 'features/projects/status'

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
    <>
      <Box
        justifyContent="space-evenly"
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr', xl: '1fr 2fr' }}
        alignItems="center"
        mb="10px"
      >
        <Card minH={156} rounded="2xl">
          <VStack alignItems="start">
            {isLoading ? (
              <BlankSlate width="60px" h="8px" />
            ) : (
              <Status value={vendorEntity?.statusLabel} id={vendorEntity?.statusLabel} />
            )}
            <Flex
              pt={4}
              color="#4A5568"
              fontWeight={500}
              fontStyle="normal"
              fontSize="18px"
              justifyContent="space-between"
              w="100%"
            >
              <Text>{t('vendorScore')}</Text>
              <Flex alignItems="center">
                <Text fontSize="20px" data-testid="vendor-score">
                  {vendorEntity?.score}
                </Text>
                <Text fontSize="20px" px="1">
                  out of 5
                </Text>
              </Flex>
            </Flex>
            <Flex w="100%">
              {isLoading ? (
                <BlankSlate width="100%" />
              ) : (
                <>
                  <Box w="100%">
                    <Progress value={scoreProgress} colorScheme="barColor" height="8px" />
                  </Box>
                </>
              )}
            </Flex>
          </VStack>
        </Card>

        <Flex
          pt={{ base: '15px', xl: '0' }}
          pl={{ base: '0px', xl: '15px' }}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px,1fr))"
          gridGap="15px"
        >
          <SimpleSlider heading={t('insuranceExpiration')} data={defaultData} isLoading={isLoading} />

          <SimpleSlider
            isLoading={isLoading}
            heading={t('licenseExpiration')}
            data={vendorEntity?.licenseDocuments
              ?.sort((curr: any, pre: any) => pre.id - curr.id)
              .map((licenseDocument: LicenseDocument) => ({
                title: LicenseType[licenseDocument.licenseType],
                date: dateFormat(licenseDocument.licenseExpirationDate),
                testId: LicenseType[licenseDocument.licenseType],
              }))}
          />
        </Flex>
      </Box>
    </>
  )
}
