import { ColorMode } from "@chakra-ui/color-mode";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import React from "react";
type cardprops = {
  UpdownIcon: React.ElementType;
  BigIcon: React.ElementType;
  number?: number;
  name: string;
  Iconbgcolor: any;
  TopnumberbgColor: any;
  numbertext?: string;
};
export const ProjectCard = (props: cardprops) => {
  const { UpdownIcon, BigIcon } = props;
  return (
    <HStack marginLeft="8px">
      <Flex alignItems="center" w={{ base: "200px", md: "unset" }}>
        <Box
          bg={props.Iconbgcolor}
          borderRadius="4px"
          padding="15px 15px 7px 15px"
          marginTop="30px"
          marginRight="10px"
          h="55px"
        >
          <BigIcon />
        </Box>
        <Flex fontSize="32px" direction="column" w="auto">
          <Box
            bg={props.TopnumberbgColor}
            fontSize="14px"
            marginRight="20px"
            w="57px"
            h="20px"
            borderRadius="4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <UpdownIcon />
            XX%
          </Box>
          <Box fontWeight="600" fontSize="30px">
            {props.number}
            {props.numbertext}
          </Box>
          <Box
            lineHeight="1"
            fontSize="19px"
            fontWeight="100"
            color="#A3AED0"
            h="auto"
          >
            {props.name}
          </Box>
        </Flex>
      </Flex>
    </HStack>
  );
};
