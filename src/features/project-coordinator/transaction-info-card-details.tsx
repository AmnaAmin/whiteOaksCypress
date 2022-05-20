import React from 'react'
import { Box, Center, CenterProps, Flex, Text, HStack, VStack, Tooltip } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { ProjectType } from 'types/project.type'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useAuth } from 'utils/auth-context'

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({ children, isLoading, title, ...rest }) => {
  return (
    <Center flexDir="column" px={4}>
      <Box fontSize="14px" color="gray.500">
        <Text color="gray.600" fontWeight={500}>
          {title}
        </Text>
        {isLoading ? <BlankSlate size="sm" /> : children}
      </Box>
    </Center>
  )
}

export const TransactionInfoCardDetails: React.FC<{
  projectData: ProjectType
  isLoading: boolean
}> = ({ projectData, isLoading }) => {
  const { data } = useAuth()
  const account = data?.user

  return (
    <>
      <Flex
        py={6}
        h={{ base: 'unset', xl: '197px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      >
        <VStack borderRight="1px solid #E5E5E5" px={2} flex={2}>
          <HStack>
            <Box>
              <InfoStructureCard title={'Project Name'} isLoading={isLoading} />
            </Box>
            <Box width="125px">
              <Text noOfLines={1}>{projectData?.name}</Text>
            </Box>
          </HStack>
          <HStack>
            <Box marginRight={1}>
              <InfoStructureCard title={'Project Type'} isLoading={isLoading} />
            </Box>
            <Box width="125px">
              <Text>{projectData?.projectTypeLabel}</Text>
            </Box>
          </HStack>
        </VStack>
        <VStack borderRight="1px solid #E5E5E5" flex={2}>
          <HStack>
            <Box>
              <InfoStructureCard title={'Client Start Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.clientStartDate as string)}</Text>
            </Box>
          </HStack>
          <HStack>
            <Box>
              <InfoStructureCard title={'Client End Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.clientDueDate as string)}</Text>
            </Box>
          </HStack>
        </VStack>
        <VStack borderRight="1px solid #E5E5E5" flex={2}>
          <HStack>
            <Box>
              <InfoStructureCard title={'WOA Start Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.woaStartDate as string)}</Text>
            </Box>
          </HStack>
          <HStack>
            <Box>
              <InfoStructureCard title={'WOA End Date'} isLoading={isLoading} />
            </Box>
            <Box>
              <Text width="100px">{dateFormat(projectData?.woaCompletionDate as string)}</Text>
            </Box>
          </HStack>
        </VStack>
        <VStack flex={2}>
          <HStack>
            <Tooltip label="Project Coordinator Name" color="black" placement="top">
              <Box>
                <InfoStructureCard title={'PC Name'} isLoading={isLoading} />
              </Box>
            </Tooltip>
            <Box>
              <Text marginRight={3}>{projectData?.projectCoordinator} </Text>
            </Box>
          </HStack>
          <HStack>
            <Tooltip label="Project Coordinator Contact" color="black">
              <Box>
                <InfoStructureCard title={'PC Contact'} isLoading={isLoading} />
              </Box>
            </Tooltip>
            <Box>
              <Text>{account?.telephoneNumber}</Text>
            </Box>
          </HStack>
        </VStack>
      </Flex>
    </>
  )
}
