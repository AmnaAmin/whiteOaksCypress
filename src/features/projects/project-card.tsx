import { Box, Center, Flex, Text } from "@chakra-ui/react";
import React from "react";

type multitypes = {
  id: number | string;
  title: string;
  number: string | number;
  IconElement: React.ReactNode;
  selectedCard: string;
  onSelectCard: (string) => void;
  disabled?: boolean;
};

export const ProjectCard = (props: multitypes) => {
  return (
    <Box as="label" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
      <Flex
        boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
        h="112px"
        borderRadius="8px"
        bg="#FFFFFF"
        justifyContent="space-between"
        border="2px solid transparent"
        pointerEvents={props.disabled ? "none" : "auto"}
        onClick={() =>
          props.onSelectCard(props.selectedCard !== props.id && props.id)
        }
        borderColor={props.selectedCard === props.id ? "brand.300" : ""}
      >
        <Box>
          <Center
            paddingTop="14px"
            marginRight={{ base: "5px", md: "24px", xl: "24px" }}
          >
            <Text
              fontSize="14px"
              fontWeight="500"
              marginTop="4px"
              paddingLeft={"20px"}
              marginRight={"45px"}
            >
              {props.title}
            </Text>
            <Flex marginLeft={"20px"}> {props.IconElement}</Flex>
          </Center>
          <Text
            fontWeight="900"
            fontSize={{ base: "22px", sm: "30px" }}
            paddingLeft={"20px"}
          >
            {props.number}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
