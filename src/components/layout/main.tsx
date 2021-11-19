import { Box, Container, Flex } from "@chakra-ui/layout";
import React from "react";

const Main: React.FC = (props) => {
  return (
    <Flex
      h={{ base: "auto", md: "100vh" }}
      p="30px"
      position="relative"
      top="100px"
      left="210px"
      right="0"
      bottom="0"
      w="100%"
      zIndex={1}
    >
      {props.children}
    </Flex>
  );
};
export default Main;
