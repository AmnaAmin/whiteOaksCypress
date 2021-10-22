import React from "react";
import { Flex } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/layout";
import { Wrap } from "@chakra-ui/layout";
import { WrapItem } from "@chakra-ui/layout";

type Show = {
  name: string;
  num: number;
  icons?: object;
};

export const Tab = (props: Show) => {
  const View: any = props.icons;
  return (
    <>
      <Box
        bg="#FFFFFF"
        border="1px solid"
        w="120px"
        h="65px"
        borderRadius="4px"
        p="5px"
        _hover={{ borderColor: "red" }}
        // position="absolute"
        // top="0"
      >
        <Box fontSize="small" color="#8e9eab">
          {props.name}
        </Box>
        <Wrap>
          <WrapItem fontSize="large" fontWeight="bold">
            {props.num}
          </WrapItem>
          <WrapItem
            fontSize="larger"
            p="4px"
            position="relative"
            left="50px"
            bg="#EAEAEA"
            borderRadius="60%"
            color="#8E0E00"
          >
            {<View />}
          </WrapItem>
        </Wrap>
      </Box>
    </>
  );
};
