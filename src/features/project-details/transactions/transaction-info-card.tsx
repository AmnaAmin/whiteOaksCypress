import React from 'react'
import { Box, Center, CenterProps, Flex, HStack, Text, Tooltip } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import Status from 'features/common/status'
import { useTranslation } from 'react-i18next'
import { Project } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { boxShadow } from 'theme/common-style'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <HStack
      flex={rest.flex || 1}
      py={4}
      spacing={0}
      borderBottom={{ base: '1px solid #CBD5E0', md: 'none' }}
      _last={{ border: 'none' }}
    >
      <Center
        justifyContent={{ base: 'start', md: 'center' }}
        px={5}
        flex={rest.flex || 1}
        position="relative"
        borderLeft="1px solid #CBD5E0"
        {...rest}
      >
        <Box fontSize="14px" fontWeight={400} fontFamily="poppins">
          <Tooltip label={title} color="gray.700" placement="top">
            <Text color="gray.700" whiteSpace={{ base: 'nowrap', md: 'unset' }} noOfLines={[0, 1]}>
              {title}
            </Text>
          </Tooltip>
          {isLoading ? <BlankSlate size="sm" /> : children}
        </Box>
      </Center>
    </HStack>
  )
}

export const TransactionInfoCard: React.FC<{
  projectData: Project
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const { t } = useTranslation()

  if ( projectData?.vendorWOStatusValue === "Declined" ) {
    projectData.vendorWOStatusValue = "Rejected"
  }

  return (
    <Flex flexWrap="wrap" w="100%" bg="white" borderRadius="6px" style={boxShadow} mt={{ base: 5, sm: 0 }}>
      <InfoStructureCard
        title={t('projectID')}
        isLoading={isLoading}
        borderLeft="none"
        sx={{
          '@media only screen and (max-width: 407px)': {
            borderRight: '1px solid #CBD5E0',
          },
        }}
      >
        <Text h="20px" color="gray.500">
          {projectData?.id}
        </Text>
      </InfoStructureCard>

      <InfoStructureCard
        isLoading={isLoading}
        title={t('WOstatus')}
        sx={{
          '@media only screen and (max-width: 407px)': {
            borderLeft: '0px',
          },
        }}
      >
        <Box>
          {projectData?.vendorWOStatusValue ? (
            <Status value={projectData?.vendorWOStatusValue} id={projectData?.vendorWOStatusValue} />
          ) : (
            <Text color="gray.500">--</Text>
          )}
        </Box>
      </InfoStructureCard>
      <InfoStructureCard
        isLoading={isLoading}
        title={t('WODueDate')}
        sx={{
          '@media only screen and (max-width: 407px)': {
            ml: '2px',
            borderLeft: '1px solid #CBD5E0',
          },
          '@media only screen and (max-width: 393px)': {
            ml: '2px',
            borderLeft: '0px',
            borderRight: '1px solid #CBD5E0',
          },
        }}
      >
        <Text h="20px" color="gray.500" whiteSpace={{ base: 'nowrap', md: 'unset' }} noOfLines={[0, 1]}>
          {projectData?.vendorWODueDate ? dateFormat(projectData?.vendorWODueDate as string) : 'mm/dd/yyyy'}
        </Text>
      </InfoStructureCard>
      <InfoStructureCard
        isLoading={isLoading}
        title={t('contactName')}
        sx={{
          '@media only screen and (max-width: 537px)': {
            ml: '1px',
            borderLeft: '0px',
            borderRight: '1px solid #CBD5E0',
          },
          '@media only screen and (max-width: 407px)': {
            ml: '1px',
            borderRight: '1px solid #CBD5E0',
          },
          '@media only screen and (max-width: 393px)': {
            ml: '2px',
            borderRight: '0px',
          },
        }}
      >
        <Text h="20px" color="gray.500" whiteSpace={{ base: 'nowrap', md: 'nowrap', sm: 'unset' }} noOfLines={[0, 1]}>
          {projectData?.projectManager}
        </Text>
      </InfoStructureCard>
      <InfoStructureCard
        isLoading={isLoading}
        title={t('contactNo')}
        sx={{
          '@media only screen and (max-width: 658px)': {
            ml: '1px',
            borderLeft: '0px',
            borderRight: '1px solid #CBD5E0 #CBD5E0',
          },
          '@media only screen and (max-width: 540px)': {
            ml: '1px',
            borderRight: '0px',
          },
          '@media only screen and (max-width: 657px)': {
            borderLeft: '0px',
          },
        }}
      >
        <Text h="20px" color="gray.500" whiteSpace={{ base: 'nowrap', md: 'unset' }} noOfLines={[0, 1]}>
          {projectData?.projectManagerPhoneNumber}
        </Text>
      </InfoStructureCard>
      <InfoStructureCard
        isLoading={isLoading}
        title={t('address')}
        flex={2}
        sx={{
          '@media only screen and (max-width: 767px)': {
            borderLeft: '0px',
          },
          '@media only screen and (max-width: 700px)': {
            borderLeft: '1px solid #CBD5E0',
          },
          '@media only screen and (max-width: 537px)': {
            borderLeft: '0px',
          },
        }}
      >
        <Text
          h="20px"
          color="gray.500"
          whiteSpace={{ base: 'nowrap', md: 'unset' }}
          noOfLines={[0, 1]}
        >{`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.state}/${projectData?.zipCode}`}</Text>
      </InfoStructureCard>
    </Flex>
  )
}
