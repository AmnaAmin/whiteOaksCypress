import React from "react";
// import { extendTheme } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { FcAlarmClock } from "react-icons/fc";
import { BsBell } from "react-icons/bs";
import { Avatar } from "@chakra-ui/react";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/layout";

const Header: React.FC = (props) => {
  return (
    <>
      <Flex
        zIndex={2}
        bg="#FFFFFF"
        w="100%"
        h="70px"
        position="fixed"
        left="0px"
        top="0px"
        border="1px solid lightgray"
        p="10px"
        boxShadow="1px 0px 4px 1px grey"
        borderRadius="4px"
      >
        {/* ///////////////////////////////logo start */}
        <Box minW="fit-content" display="flex" p="10px">
          <Box display="flex" fontSize="large">
            <Box p="5px">
              <FcAlarmClock />
            </Box>
            <Box fontWeight="bold">WhiteOaks</Box>
          </Box>
        </Box>
        {/* /////////////////////// logo end */}

        <Box w="100%" display="flex" justifyContent="flex-end" p="6px" h="60px">
          <Wrap
            minW="fit-content"
            justifyContent="space-evenly"
            display="flex"
            p={[10, 10, 0, 0]}
            mr={40}
            fontSize="large"
            color="#757F9A"
          >
            <WrapItem px="20px">Help</WrapItem>
            <WrapItem px="20px">Support</WrapItem>
            <WrapItem px="20px">English</WrapItem>
            <WrapItem px="20px" p="5.5px">
              <BsBell color="gray.100" />
            </WrapItem>

            <WrapItem px="20px">
              <Avatar
                size="2xl"
                name="Christian Nwamba"
                src="https://bit.ly/code-beast"
                borderRadius="50%"
                _hover={{
                  boxShadow: "1px 0px 4px 1px grey;",
                }}
              />
              <h3 style={{ paddingLeft: "10px", fontWeight: "bolder" }}>
                Dan Abrahmov
              </h3>
            </WrapItem>
          </Wrap>
        </Box>
      </Flex>
    </>
  );
};

export default Header;
