import React from "react";
import { Box, HStack, Flex, Text } from "@chakra-ui/react";
type cardprops = {
  UpdownIcon: React.ElementType;
  BigIcon: React.ElementType;
  number?: number;
  name: string;
  Iconbgcolor: any;
  TopnumberbgColor: any;
  numbertext?: string;
  numberColor: string;
};
export const ProjectSummaryCard = (props: cardprops) => {
  const { UpdownIcon, BigIcon, numberColor } = props;
  return (
    <HStack>
      <Flex alignItems="end" justifyContent="end">
        <Box
          bg={props.Iconbgcolor}
          borderRadius="4px"
          padding="15px 15px 7px 15px"
          marginRight="10px"
          h="55px"
        >
          <BigIcon />
        </Box>
        <Flex fontSize="32px" direction="column" w="auto">
          <Box
            bg={props.TopnumberbgColor}
            fontSize="12px"
            fontStyle="normal"
            fontWeight={400}
            marginRight="20px"
            w="57px"
            h="24px"
            borderRadius="6px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={numberColor}
            mb="5px"
          >
            <Box fontSize="18px">
              <UpdownIcon />
            </Box>
            &nbsp;XX%
          </Box>
          <Box
            fontWeight="800"
            fontSize="20px"
            fontStyle="normal"
            color="#4A5568"
            height="40px"
          >
            {props.number}
            {props.numbertext}
          </Box>
          <Text
            lineHeight="3"
            fontWeight={500}
            fontSize="18px"
            color="#A0AEC0"
            pb="5px"
          >
            {props.name}
          </Text>
        </Flex>
      </Flex>
    </HStack>
  );
};
