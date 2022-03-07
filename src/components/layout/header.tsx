import {
  Avatar,
  Box,
  Button,
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
import DropdownLanguage from "components/translation/DropdownLanguage";
// import { IRootState } from "app/shared/reducers";
import React, { Suspense, useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaAngleDown, FaAngleUp, FaBell } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "utils/auth-context";
import LogoIcon from "../../icons/header-logo";
import { RouterLink } from "../router-link/router-link";

// const Notification = React.lazy(() => import("./notification")); // Lazy-loaded

const UserInfo: React.FC = () => {
  const { data } = useAuth();
  const account = data?.user;
  const userName = `${account?.firstName} ${account?.lastName}`;
  const isAdmin = useMemo(() => {
    return account?.authorities.find((authority) => authority === "ROLE_ADMIN");
  }, [account?.authorities]);

  return (
    <HStack>
      <Avatar
        name={userName}
        src={account?.imageUrl ?? ""}
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
            fontSize="md"
            pr="1"
            color={mode("blackAlpha.800", "whiteAlpha.800")}
          >
            {userName}
          </Text>
        </Flex>
        <Text fontSize="sm" color={mode("blackAlpha.700", "whiteAlpha.700")}>
          {isAdmin ? "Admin" : "User"}
        </Text>
      </VStack>
    </HStack>
  );
};

type HeaderProps = {
  toggleMenu?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const { logout } = useAuth();
  const [show, setShow] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

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
            <DropdownLanguage />
          </Box>
          <Box position="relative">
            <Menu
              isOpen={showNotification}
              onClose={() => setShowNotification(false)}
              onOpen={() => setShowNotification(true)}
            >
              <MenuButton
                transition="all 0.2s"
                color="gray"
                _active={{ color: "#4E87F8" }}
              >
                <FaBell fontSize="1.5rem" />
              </MenuButton>

              {showNotification && (
                <Suspense
                  fallback={() => (
                    <AiOutlineLoading3Quarters
                      className="fa-spin"
                      fontSize="1.5rem"
                    />
                  )}
                >
                  {/* <Notification /> */}
                </Suspense>
              )}
            </Menu>
          </Box>

          {/** User Dropdown Menu */}
          <Menu placement="bottom">
            <MenuButton
              variant="text"
              colorScheme="blue"
              bgSize="auto"
              w={{ base: "50px", md: "auto" }}
              onClick={() => {
                setShow(!show);
              }}
            >
              <UserInfo />
            </MenuButton>
            <MenuList minWidth="243px">
              <MenuItem>
                <RouterLink to="/settings">Settings</RouterLink>
              </MenuItem>
              <MenuItem>
                <RouterLink to="/password">Password</RouterLink>
              </MenuItem>
              <MenuItem>
                <RouterLink to="/help">help</RouterLink>
              </MenuItem>
              <MenuItem>
                <RouterLink to="/support">Support</RouterLink>
              </MenuItem>
              <MenuItem>
                <Box onClick={logout} fontSize="sm">
                  Signout
                </Box>
              </MenuItem>
            </MenuList>
            <Box position="relative" bottom=" 8.5px" right=" 16px">
              {show ? <FaAngleDown /> : <FaAngleUp />}
            </Box>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
};
