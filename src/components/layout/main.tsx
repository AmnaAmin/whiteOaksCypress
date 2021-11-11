import { Box, Flex } from "@chakra-ui/layout";
import React, { useState } from "react";

const Main: React.FC = (props) => {
  const [focusBarIndex, setFocusBarIndex] = useState(null);

  return (
    <Flex
      h="95vh"
      p="30px"
      position="absolute"
      top="70px"
      left="230px"
      right="0"
      bottom="0"
      border="1px solid colors.brand.100"
    >
      {props.children}
    </Flex>
  );
};
export default Main;
