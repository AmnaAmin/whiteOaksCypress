import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

export const ProgressData: React.FC<{
  firstValue: number;
  secondValue: number;
}> = (props) => {
  const { firstValue, secondValue, ...rest } = props;
  return (
    <Flex pos="relative" fontFamily="system-ui" color=" #334D6E" w="100%">
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
