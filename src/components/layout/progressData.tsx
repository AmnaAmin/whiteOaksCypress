import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

export const ProgressData: React.FC<{
  firstValue: number;
  secondValue: number;
}> = (props) => {
  const { firstValue, secondValue, ...rest } = props;
  return (
    <Flex
      pos="relative"
      bottom="40px"
      fontFamily="system-ui"
      color=" #334D6E"
      alignItems="baseline"
      marginInlineStart="20px"
    >
      <Box fontSize="41px" fontWeight={500}>
        {firstValue}
      </Box>
      <Text fontWeight={500} fontSize="22px" w="3em">
        out of
      </Text>
      <Box fontWeight={500} fontSize="23px">
        {secondValue}
      </Box>
    </Flex>
  );
};
