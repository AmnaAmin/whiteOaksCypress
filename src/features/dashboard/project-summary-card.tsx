import React from 'react'
import { Box, Flex, Text, Center, Icon } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
type cardprops = {
  UpdownIcon: React.ElementType
  BigIcon: React.ElementType
  number?: number
  name: string
  Iconbgcolor: any
  numbertext?: string
  updownIconColor: string
  isLoading?: boolean
  testId?: string
}
export const ProjectSummaryCard = (props: cardprops) => {
  const { UpdownIcon, BigIcon, updownIconColor, isLoading } = props
  return (
    <Flex
      pr={{ base: 'unset', lg: '30px', xl: '60px' }}
      p={{ base: '15px', sm: '20px' }}
      justifyContent={{ base: 'unset', xl: 'center' }}
    >
      <Center bg={props.Iconbgcolor} borderRadius="4px" marginRight="10px" p={3} h={45} w={45} rounded={50}>
        <Icon as={BigIcon} fontSize={20} />
      </Center>
      <Flex fontSize="32px" direction="column" w="auto" lineHeight={1.2}>
        {isLoading ? (
          <BlankSlate width="100%" h="10px" />
        ) : (
          <Flex alignItems="center">
            <Box data-testId={props.testId} fontWeight={600} fontSize={18} fontStyle="normal" color="gray.600">
              {props.number}
              {props.numbertext}
            </Box>
            <Box fontSize={20} color={updownIconColor} pl={1.5}>
              <UpdownIcon />
            </Box>
          </Flex>
        )}
        <Text fontWeight={400} fontSize={16} color="gray.600" pb={3}>
          {props.name}
        </Text>
      </Flex>
    </Flex>
  )
}
