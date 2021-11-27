import { Box, HStack } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import React from "react";
type CardProps = {
  TopIcon: React.ElementType;
  BigIcon: React.ElementType;
  number?: number;
  name: string;
  color: any;
  iconColor: any;
  numbertext?: string;
};
export const ProjectCard = (props: CardProps) => {
  const { TopIcon, BigIcon } = props;
  return (
    <HStack>
      <Flex
        alignItems="center"
        borderRadius={{ base: "8px", md: "unset" }}
        w={{ base: "200px", md: "unset" }}
        paddingLeft={{ base: "unset", md: "unset" }}
        bg={{ base: "white", md: "unset" }}
        marginLeft={{ base: "0px", md: "unset" }}
      >
        <Box
          bg={props.color}
          borderRadius="4px"
          padding="15px 15px 7px 15px"
          marginTop="30px"
          marginRight="10px"
        >
          <BigIcon />
        </Box>
        <Flex fontSize="32px" direction="column" w="auto">
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
            w="7em"
          >
            {props.name}
          </Box>
        </Flex>
      </Flex>
    </HStack>
  );
};
