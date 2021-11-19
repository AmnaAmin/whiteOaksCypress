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
    <HStack>
      <Flex alignItems="center">
        <Box
          bg={{
            xl: props.color,
            lg: props.color,
            md: props.color,
            base: props.color,
          }}
          fontSize={{ xl: "30px", lg: "15px", md: "10px", base: "5px" }}
          borderRadius="4px"
          padding={{
            xl: "15px 15px 7px 15px",
            lg: "13px 13px 6px 13px",
            md: "12px 12px 5px 12px",
            base: "8px 8px 4px 8px",
          }}
          marginRight="12px"
          marginTop="30px"
        >
          <BigIcon />
        </Box>

        <Flex fontSize="32px" direction="column" w="auto">
          <Box
            bg={props.iconColor}
            fontSize={{ xl: "14px", lg: "12px", md: "10px", base: "10px" }}
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

          <Box
            fontWeight="600"
            fontSize={{ xl: "30px", lg: "20px", md: "20px", base: "20px" }}
          >
            {props.number}
            {props.numbertext}
          </Box>
          <Box
            lineHeight="1"
            fontSize={{ xl: "19px", lg: "14px", md: "14px", base: "14px" }}
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
