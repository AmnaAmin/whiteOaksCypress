import React from 'react'
import { Box, HStack, Flex, Text } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
type cardprops = {
  UpdownIcon: React.ElementType
  BigIcon: React.ElementType
  number?: number
  name: string
  Iconbgcolor: any
  TopnumberbgColor: any
  numbertext?: string
  numberColor: string
  isLoading?: boolean
}
export const ProjectSummaryCard = (props: cardprops) => {
  const { UpdownIcon, BigIcon, numberColor, isLoading } = props
  return (
    <HStack>
      <Flex alignItems="end" justifyContent="end">
        <Box bg={props.Iconbgcolor} borderRadius="4px" padding="15px 15px 7px 15px" marginRight="10px" h="55px">
          <BigIcon />
        </Box>
        <Flex fontSize="32px" direction="column" w="auto">
          <Box
            bg={props.TopnumberbgColor}
            fontSize="14px"
            marginRight="20px"
            w="57px"
            h="24px"
            borderRadius="6px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={numberColor}
          >
            <Box fontSize="20px">
              <UpdownIcon />
            </Box>
            &nbsp;XX%
          </Box>
          {isLoading ? (
            <BlankSlate width="100%" />
          ) : (
            <Box fontWeight="600" fontSize="24px" height="40px">
              {props.number}
              {props.numbertext}
            </Box>
          )}
          <Text lineHeight="1" fontWeight="normal" fontSize="20px" color="gray.400">
            {props.name}
          </Text>
        </Flex>
      </Flex>
    </HStack>
  )
}
