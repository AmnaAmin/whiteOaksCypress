import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
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
              <Link>Settings</Link>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <AiFillLock />
              <Link>Password</Link>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <AiFillQuestionCircle />
              <Link>Help</Link>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <AiFillMail />
              <Link>Support</Link>
            </MenuItem>

            <MenuItem
              _focus={{ bg: "aliceblue" }}
              _active={{ bgColor: "brown", color: "white" }}
              margin="0px"
            >
              <FaSignOutAlt />
              <Link>Sign out</Link>
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
