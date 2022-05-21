import React from 'react'
import { Box, Center, CenterProps, Flex, Text, HStack, VStack } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { ProjectType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="row" px={5} flex={rest.flex || 1} {...rest}>
      <Box fontSize="14px" fontWeight={500} color="gray.500">
        <Text color="gray.600">{title}</Text>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const TransactionInfoCardDetails: React.FC<{
  projectData: ProjectType
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  return (
    <>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '197px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
        marginTop={160}
      >
        <VStack borderRight="1px solid #E5E5E5">
          <HStack spacing={3} marginRight={2}>
            <Box>
              <InfoStructureCard title={'Project Name'} isLoading={isLoading} />
            </Box>
            <Box width="180px">
              <Text>{projectData?.name}</Text>
            </Box>
          </HStack>
          <HStack spacing={6} marginRight={2}>
            <Box>
              <InfoStructureCard title={'Project Type'} isLoading={isLoading} />
            </Box>
            <Box width="180px">
              <Text>{projectData?.projectTypeLabel}</Text>
            </Box>
          </HStack>
        </VStack>
        <VStack borderRight="1px solid #E5E5E5">
          <HStack spacing={1} marginRight={2}>
            <Box>
              <InfoStructureCard title={'Client Start Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.clientStartDate as string)}</Text>
            </Box>
          </HStack>
          <HStack spacing={3} marginRight={2}>
            <Box>
              <InfoStructureCard title={'Client End Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.clientDueDate as string)}</Text>
            </Box>
          </HStack>
        </VStack>
        <VStack borderRight="1px solid #E5E5E5">
          <HStack spacing={1} marginRight={2}>
            <Box>
              <InfoStructureCard title={'WOA Start Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.woaStartDate as string)}</Text>
            </Box>
          </HStack>
          <HStack spacing={3} marginRight={2}>
            <Box>
              <InfoStructureCard title={'WOA End Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.woaCompletionDate as string)}</Text>
            </Box>
          </HStack>
        </VStack>
        <VStack>
          <HStack spacing={4}>
            <Box>
              <InfoStructureCard title={'Project Coordinator Name'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="120px">{projectData?.projectManager}</Text>
            </Box>
          </HStack>
          <HStack spacing={1}>
            <Box>
              <InfoStructureCard title={'Project Coordinator Contact'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="120px">{projectData?.projectManagerPhoneNumber}</Text>
            </Box>
          </HStack>
        </VStack>
      </Flex>
    </>
  )
}
