import { Progress } from "@chakra-ui/react";
import React from "react";

const Progressbar = () => {
  return (
    <>
      <Progress value={60} w="233px" borderRadius="2px" />
    </>
  );
};

export default Progressbar;
