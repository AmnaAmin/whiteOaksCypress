import { ColorMode } from "@chakra-ui/color-mode";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import React from "react";

type cardprops = {
  TopIcon: React.ElementType;
  BigIcon: React.ElementType;
  number?: number;
  name: string;
  color: any;
  iconColor: any;
  numbertext?: string;
};

export const ProjectCard = (props: cardprops) => {
  const { TopIcon, BigIcon } = props;
  return (
    <VStack w="auto">
      <Box
        bg={props.iconColor}
        fontSize="14px"
        marginRight="20px"
        w="57px"
        h="20px"
        borderRadius="4px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <TopIcon />
        XX%
      </Box>
      <HStack>
        <Flex alignItems="center">
          <Box
            bg={props.color}
            fontSize="30"
            borderRadius="4px"
            padding="15px 15px 7px 15px"
            marginRight="12px"
          >
            <BigIcon />
          </Box>

          <Flex fontSize="32px" direction="column" w="auto" h="57px">
            <Box fontWeight="600">
              {props.number}
              {props.numbertext}
            </Box>
            <Box
              lineHeight="1"
              fontSize=" 19px"
              fontWeight="100"
              w="159px"
              color="#A3AED0"
              h="auto"
            >
              {props.name}
            </Box>
          </Flex>
        </Flex>
      </HStack>
    </VStack>
  );
};
