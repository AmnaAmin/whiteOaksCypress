import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

export const ProgressData: React.FC<{
  firstValue: number;
  secondValue: number;
}> = (props) => {
  const { firstValue, secondValue } = props;
  return (
    <Flex pos="relative" color="blackAlpha.700" w="100%">
      <Box fontSize="22px" fontWeight={800}>
        {firstValue}
      </Box>
      <Text fontWeight={800} fontSize="22px" w="3em">
        out of
      </Text>
      <Box fontWeight={800} fontSize="22px">
        {secondValue}
      </Box>
    </Flex>
  );
};
