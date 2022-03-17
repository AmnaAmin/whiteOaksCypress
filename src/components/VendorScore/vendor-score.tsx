import React from 'react'
import { VStack, Text, Flex, Box, Tag, Progress, Heading } from '@chakra-ui/react'

import { Card } from '../card/card'
import { SimpleSlider } from './SimpleSlider'
import { useVendorEntity } from 'utils/vendor-dashboard'
import { useTranslation } from 'react-i18next'
import 'components/translation/i18n'
import { LicenseDocument } from 'types/vendor.types'
import { dateFormat } from 'utils/date-time-utils'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

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
    },
    {
      title: 'COI GL',
      date: vendorEntity?.coiglExpirationDate,
    },
    {
      title: 'Agreement Signed',
      date: vendorEntity?.agreementSignedDate,
    },
    {
      title: 'Auto Insurance',
      date: vendorEntity?.autoInsuranceExpirationDate,
    },
  ].filter(item => item.date)

  return (
    <>
      <Card w="100%" mb="22px">
        <Box
          justifyContent="space-evenly"
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: '1fr', lg: '1fr 2fr' }}
          alignItems="end"
        >
          <VStack py="4" alignItems="start">
            {isLoading ? (
              <BlankSlate width="60px" />
            ) : (
              <Tag size="md" color="green.500" bg="green.100">
                {vendorEntity?.statusLabel}
              </Tag>
            )}
            <Heading fontSize="22px">{t('vendorScore')}</Heading>
            <Flex alignItems="baseline" w="100%">
              {isLoading ? (
                <BlankSlate width="90%" />
              ) : (
                <>
                  <Box flex="1" maxW="200px" mr="10px">
                    <Progress value={scoreProgress} borderRadius="2px" colorScheme="barColor" height="11px" />
                  </Box>
                  <Box px="2">
                    <Flex pos="relative" fontWeight={800} color="gray.800" w="100%" alignItems="center">
                      <Text fontSize="30px" mb="4px" data-testid="vendor-score">
                        {vendorEntity?.score}
                      </Text>
                      <Text fontSize="16px" px="1">
                        out of 5
                      </Text>
                    </Flex>
                  </Box>
                </>
              )}
            </Flex>
          </VStack>
          <Flex
            justifyContent="space-between"
            overflow="auto"
            direction={{
              base: 'column',
              md: 'row',
            }}
          >
            <Box overflow="hidden" padding={2} flex="1" mr={{ base: '0', md: '10px' }} mb={{ base: '15px', md: '0' }}>
              {isLoading ? (
                <BlankSlate width="100%" h="130px" rounded="2xl" />
              ) : (
                <SimpleSlider heading={t('insurance')} data={defaultData} />
              )}
            </Box>
            <Box flex="1" overflow="hidden" padding={2}>
              {isLoading ? (
                <BlankSlate width="100%" h="120px" rounded="2xl" />
              ) : (
                <SimpleSlider
                  heading={t('license')}
                  data={vendorEntity?.licenseDocuments
                    ?.sort((curr: any, pre: any) => pre.id - curr.id)
                    .map((licenseDocument: LicenseDocument) => ({
                      title: LicenseType[licenseDocument.licenseType],
                      date: dateFormat(licenseDocument.licenseExpirationDate),
                    }))}
                />
              )}
            </Box>
          </Flex>
        </Box>
      </Card>
    </>
  )
}
