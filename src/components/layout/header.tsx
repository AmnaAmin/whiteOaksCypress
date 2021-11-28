import {
  Avatar,
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import LogoIcon from "icons/Header-logo";
import { FaAngleDown } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

const UserInfo: React.FC = () => {
  return (
    <HStack>
      <Avatar
        name="Dan Abrahmov"
        src="https://bit.ly/dan-abramov"
        w={{ base: "30px", md: "42px" }}
        h={{ base: "30px", md: "42px" }}
      />
      <VStack
        alignItems="start"
        spacing="0.3"
        visibility={{ base: "hidden", md: "visible" }}
      >
        <Flex alignItems="center">
          <Text
            fontSize="sm"
            pr="1"
            color={mode("blackAlpha.800", "whiteAlpha.800")}
          >
            Dan Abrahmov
          </Text>
          <FaAngleDown fontSize="0.7rem" />
        </Flex>
        <Text fontSize="xs" color={mode("blackAlpha.700", "whiteAlpha.700")}>
          Admin
        </Text>
      </VStack>
    </HStack>
  );
};

type HeaderProps = {
  toggleMenu?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <Box
      py="1.5"
      px={{ base: "1", md: "5" }}
      bg={mode("white", "black")}
      boxShadow="base"
      w="100%"
    >
      <HStack justifyContent="space-between">
        <Flex>
          <Button
            leftIcon={<GiHamburgerMenu />}
            variant="unstyled"
            size="md"
            mr="2"
            onClick={toggleMenu}
            display={{ base: "inline", lg: "none" }}
          />
          <LogoIcon />
        </Flex>

        <HStack spacing="5">
          {/** Language Dropdown Menu */}
          <Box display={{ base: "none", md: "block" }}>
            <Menu placement="bottom">
              <MenuButton variant="text" colorScheme="blue">
                <Flex alignItems="center">
                  <Text
                    fontSize="sm"
                    pr="1"
                    color={mode("blackAlpha.800", "whiteAlpha.800")}
                  >
                    English
                  </Text>
                  <FaAngleDown fontSize="0.7rem" />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem>English</MenuItem>
                <MenuItem>Spanish</MenuItem>
              </MenuList>
            </Menu>
          </Box>

          {/** Notifications */}
          <Box position="relative">
            <BsBell fontSize="1.3rem" />
            <Circle
              bg="red.400"
              w="7px"
              h="7px"
              position="absolute"
              top="1px"
              right="1px"
            />
          </Box>

          {/** User Dropdown Menu */}
          <Menu placement="bottom">
            <MenuButton
              variant="text"
              colorScheme="blue"
              bgSize="auto"
              w={{ base: "50px", md: "auto" }}
            >
              <UserInfo />
            </MenuButton>
            <MenuList>
              <MenuItem>Re-order columns</MenuItem>
              <MenuItem>Add new property</MenuItem>
              <MenuItem>Import list</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
};
