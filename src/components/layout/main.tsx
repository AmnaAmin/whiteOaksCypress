import { Box, Container, Flex } from "@chakra-ui/layout";
import React from "react";

const Main: React.FC = (props) => {
  return (
    <Flex
      h={{ base: "auto", md: "100vh" }}
      p="30px"
      position="absolute"
      top="70px"
      left={{ base: "30px", md: "210px" }}
      right="0"
      bottom="0"
      // border="1px solid blue"
      w={{ base: "100%", md: "100%" }}
      zIndex={4}
    >
      {props.children}
    </Flex>
  );
};
export default Main;
