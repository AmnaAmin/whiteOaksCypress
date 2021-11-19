import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { Box, Link, VStack } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  AiFillLock,
  AiFillQuestionCircle,
  AiFillMail,
  AiFillTool,
} from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";

export const Avatars = () => {
  return (
    <Flex alignItems="center">
      <Box paddingRight="2px">
        <Wrap>
          <WrapItem>
            <Avatar
              h="43"
              w="42px"
              src=" https://bit.ly/sage-adebayo"
              borderRadius="50%"
            />
          </WrapItem>
        </Wrap>
      </Box>
      <VStack
        paddingRight="10px"
        fontSize="12px"
        margin="0"
        alignItems="start"
        lineHeight="1"
      >
        <Menu>
          <MenuButton border="none" bg="none" p="0">
            Sireea Ferguson <ChevronDownIcon />
          </MenuButton>

          <MenuList
            fontSize="18px "
            width="207px"
            font-family="initial"
            color="black"
            marginTop="27px"
          >
            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
            >
              <AiFillTool />
              <a>Settings</a>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <AiFillLock />
              <a>Password</a>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <AiFillQuestionCircle />
              <a>Help</a>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <AiFillMail />
              <a>Support</a>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <FaSignOutAlt />
              <a>Sign out</a>
            </MenuItem>
          </MenuList>
        </Menu>
        <Box margin="0px">
          <Link>Admin</Link>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Avatars;

// "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "full" | "2xs"
// Default
// "md
