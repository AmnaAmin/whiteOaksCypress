import { Box, BoxProps } from "@chakra-ui/layout";
import { auto } from "@popperjs/core";
import React from "react";

const Card: React.FC<BoxProps> = (props) => {
  return (
    <>
      <Box
        borderR="6px"
        boxShadow="1px 1px 12px rgba(0,0,0,0.2)"
        bg="white"
        p="15px"
        h={props.height || "auto"}
        {...props}
      >
        {props.children}
      </Box>
    </>
  );
};

export default Card;
