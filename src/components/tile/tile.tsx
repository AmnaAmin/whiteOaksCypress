import React from "react";
import { Flex } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/layout";
import { Wrap } from "@chakra-ui/layout";
import { WrapItem } from "@chakra-ui/layout";

type Show = {
  name: string;
  num: number;
  IconElement: React.ElementType;
};

export const Tile = (props: Show) => {
  const { IconElement } = props;

  return (
    <>
      <Box
        bg="#FFFFFF"
        w="120px"
        h="65px"
        borderRadius="4px"
        _hover={{ borderColor: "#8E0E00" }}
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
            <IconElement />
          </WrapItem>
        </Wrap>
      </Box>
    </>
  );
};
