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
  Button,
} from '@chakra-ui/react'

import { Card } from '../card/card'
import { SimpleSlider } from './SimpleSlider'
import { useVendorCards, useVendorEntity } from 'api/vendor-dashboard'
import { useTranslation } from 'react-i18next'

import { LicenseDocument } from 'types/vendor.types'
import { dateFormat } from 'utils/date-time-utils'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import Status from 'features/common/status'
import numeral from 'numeral'
import { DASHBOARD } from 'features/vendor/dashboard/dashboard.i18n'

const LicenseType: { [key: number]: string } = {
  1: 'Electrical',
  2: 'Plumbing',
  3: 'General Contractor',
  4: 'Roofing',
  5: 'Architecture',
  6: 'Mechanical',
}

export const VendorScore: React.FC<{ vendorId: number; setSeeDetails: (any) => void; seeDetails: boolean }> = ({
  vendorId,
  setSeeDetails,
  seeDetails,
}) => {
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
    <>
      <Box
        justifyContent="space-evenly"
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr', xl: '1fr 2fr' }}
        alignItems="center"
      >
        <Card h={156} rounded="2xl">
          <Flex h="99%" w="100%">
            <>
              <HStack w="100%">
                <Flex h="100%" alignItems="end">
                  <CircularProgress color="#4E87F8" capIsRound value={scoreProgress} size="91px">
                    <CircularProgressLabel h="57%">
                      {isLoading ? (
                        <Center>
                          <Spinner size="xl" />
                        </Center>
                      ) : (
                        <Box alignItems="center">
                          <Text fontSize="18px" fontWeight={700} color="gray.600" data-testid="vendor-score">
                            {vendorEntity?.score}
                          </Text>
                          <Text color="gray.400" fontWeight={400} fontSize="10px" px="1">
                            {t('outOf')} 5
                          </Text>
                        </Box>
                      )}
                    </CircularProgressLabel>
                    <Text textAlign="center" fontSize="12px" fontWeight={500} color="gray.600" fontStyle="normal">
                      {t('score')}
                    </Text>
                  </CircularProgress>
                </Flex>
                <HStack h="100%" w="100%" justifyContent="space-between">
                  <HStack>
                    <Box mt="18px" ml="30px ">
                      {isLoading ? (
                        <BlankSlate width="200px" h="20px" />
                      ) : (
                        <Text fontSize="18px" color="gray.600" fontWeight={700}>
                          {ammount}
                        </Text>
                      )}
                      <Text fontSize="18px" color="gray.600" fontWeight={500}>
                        {t('upcomingPayment')}
                      </Text>
                    </Box>
                  </HStack>
                  <VStack justifyContent="space-between" h="100%" alignItems="end">
                    {isLoading ? (
                      <BlankSlate width="60px" h="15px" />
                    ) : (
                      <Status value={vendorEntity?.statusLabel} id={vendorEntity?.statusLabel} />
                    )}

                    <Button variant="link" colorScheme="brand" onClick={() => setSeeDetails(!seeDetails)}>
                      {t(`${DASHBOARD}.seeDetails`)}
                    </Button>
                  </VStack>
                </HStack>
              </HStack>
            </>
          </Flex>
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
