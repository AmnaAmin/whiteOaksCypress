import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
export const ProgressData: React.FC<{
  firstValue: number;
  secondValue: number;
}> = props => {
  const { firstValue, secondValue } = props;
  return (
    <Flex pos="relative" color="blackAlpha.700" w="100%" alignItems="center">
      <Text fontSize="xx-large" fontWeight={800} mb="4px">
        {firstValue}
      </Text>
      <Text fontSize="22px" px="1" fontWeight="bold">
        out of
      </Text>
      <Text fontSize="22px" fontWeight="bold">
        {secondValue}
      </Text>
    </Flex>
  );
};
