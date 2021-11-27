import { Flex } from "@chakra-ui/layout";
import React from "react";

const Main: React.FC = (props) => {
  return (
    <Flex
      h={{ base: "auto" }}
      position="relative"
      // ml={{ base: "50px", md: 0 }}
      mr={{ base: 0, md: "100px", lg: 0 }}
      // p={{ base: "0px", md: 0 }}
      top="90px"
      left={{ base: "10px", md: "255px" }}
      right="0"
      bottom="0"
      w={{ base: "530px", md: "85%" }}
      zIndex={4}
      // border="2px solid green"
    >
      {props.children}
    </Flex>
  );
};
export default Main;
