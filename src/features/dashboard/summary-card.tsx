import { Box, HStack, Text } from '@chakra-ui/layout';
import { Center, Flex } from '@chakra-ui/react';
import React from 'react';
type cardprops = {
  UpdownIcon: React.ElementType;
  BigIcon: React.ElementType;
  number?: number;
  name: string;
  Iconbgcolor: any;
  TopnValuebgColor: any;
  numberText?: string;
  TopValuecolor: string;
};
export const SummaryCard = (props: cardprops) => {
  const { UpdownIcon, BigIcon } = props;
  return (
    <HStack marginLeft="8px">
      <Flex alignItems="center" w={{ base: 'unset', md: 'unset' }}>
        <Center bg={props.Iconbgcolor} borderRadius="4px" marginTop="30px" marginRight="10px" h="44px" w="46px">
          <BigIcon />
        </Center>
        <Flex fontSize="32px" direction="column" w="auto">
          <Box
            bg={props.TopnValuebgColor}
            fontSize="14px"
            marginRight="20px"
            w="57px"
            h="24px"
            borderRadius="6px"
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            color={props.TopValuecolor}
          >
            <Box as="div" w="20px" h="20px" fontWeight={900} fontSize="30px">
              <UpdownIcon />
            </Box>
            <Text w="30px" h="20px" fontWeight="400" lineHeight="20px" fontSize="14px">
              XX%
            </Text>
          </Box>
          <Box fontWeight="800" fontSize="24px" lineHeight="32px">
            {props.number}
            {props.numberText}
          </Box>
          <Box lineHeight={{ base: '1rem', md: '20px' }} fontSize={{ base: '13px', md: '20px' }} fontWeight="400" color="#A0AEC0" h="auto">
            {props.name}
          </Box>
        </Flex>
      </Flex>
    </HStack>
  );
};
