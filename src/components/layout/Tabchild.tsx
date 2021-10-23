import React from "react";
import { Tab } from "./Tab";
import { Grid } from "@chakra-ui/layout";
import { AiOutlineFileText, AiOutlineFileExclamation } from "react-icons/ai";
import { BiDollarCircle, BiCheckSquare } from "react-icons/bi";
import { HiOutlineCalendar } from "react-icons/hi";
import { ImFileText } from "react-icons/im";
import { MdOutlineFactCheck } from "react-icons/md";
import { Box } from "@chakra-ui/layout";

const Tabchild = () => {
  return (
    <>
      <div className="Tabs_parent">
        <Box position="absolute" left="267px">
          Project Overview
        </Box>
        <Grid
          templateColumns="repeat(7,130px)"
          gap={11}
          position="absolute"
          left="268px"
          top="65px"
        >
          <Tab name="NEW" num={5} icons={AiOutlineFileText} />
          <Tab name="ACTIVE" num={12} icons={MdOutlineFactCheck} />
          <Tab name="PUNCHED" num={8} icons={AiOutlineFileExclamation} />
          <Tab name="CLOSED" num={25} icons={BiCheckSquare} />
          <Tab name="INVOICED" num={9} icons={ImFileText} />
          <Tab name="PAST DUE" num={3} icons={HiOutlineCalendar} />
          <Tab name="CLIENT PAID" num={6} icons={BiDollarCircle} />
        </Grid>
      </div>
    </>
  );
};

export default Tabchild;
