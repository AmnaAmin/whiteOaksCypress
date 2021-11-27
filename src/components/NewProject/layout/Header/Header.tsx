import React from "react";
import { Box, HStack, Flex } from "@chakra-ui/react";
import Avatars from "./Avatar";
import LogoIcon from "../../../../Icons/Header-logo";
import BellIcon from "../../../../Icons/Bell-icon";
import HeaderDropdown from "./DropDown";

export const Header: React.FC = () => {
  return (
    <HStack
      boxShadow="1px 1px 2px rgba(0,0,0,0.2)"
      position="fixed"
      width="100%"
      h="75px"
      left={0}
      top={0}
      right={0}
      bgColor="white"
      zIndex={7}
    >
      <Box ml="35px">
        <LogoIcon />
      </Box>
      <Flex w="100%" justifyContent="flex-end" alignItems="center">
        <Box
          paddingRight="46px"
          _selected={{ color: "blue" }}
          display="flex"
          alignItems="center"
        >
          <HeaderDropdown />

          <BellIcon />
        </Box>
        <Box alignItems="center">
          <Avatars />
        </Box>
      </Flex>
    </HStack>
  );
};
