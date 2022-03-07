import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { SidebarLink } from "./sidebar-link";
import { FaAlignCenter, FaHome, FaUser } from "react-icons/fa";
import { useMobileMenuState } from "utils/hooks/useMobileMenuState";
import { AiOutlineVerticalLeft, AiOutlineVerticalRight } from "react-icons/ai";

export const Layout: React.FC = (props) => {
  const { isOpen, toggle } = useMobileMenuState();

  return (
    <VStack width="100%">
      <Box position="fixed" top="0" left="0" right="0" zIndex="sticky">
        <Header toggleMenu={toggle} />
      </Box>

      <Container
        maxW="full"
        pt="65px"
        position="relative"
        sx={{ "--sidebar-width": "15.5rem" }}
      >
        <Flex
          // bg={mode('white', 'black')}
          position="fixed"
          top="60px"
          bottom="0"
          left={isOpen ? "0" : "calc((var(--sidebar-width)+100) * -1)"}
          transition="left 0.5s ease-in-out"
          // boxShadow={isOpen ? 'xl' : '0'}
          zIndex="dropdown"
        >
          <Box
            as="nav"
            display="block"
            flex="1"
            width="var(--sidebar-width)"
            py="5"
            bg={mode("white", "black")}
            boxShadow={isOpen ? "xl" : "0"}
          >
            <Box fontSize="sm" lineHeight="short">
              <Sidebar>
                <SidebarLink
                  pathTo="/vendorDashboard"
                  title="Dashboard"
                  icon={<FaHome />}
                />
                <SidebarLink
                  pathTo="/projects"
                  title="Projects"
                  icon={<FaAlignCenter />}
                />
                <SidebarLink
                  pathTo="/vendors"
                  title="Vendor Profile"
                  icon={<FaUser />}
                />
              </Sidebar>
            </Box>
          </Box>
          <Button
            display={{ base: "none", lg: "unset" }}
            _focus={{ outline: "none" }}
            leftIcon={
              isOpen ? <AiOutlineVerticalRight /> : <AiOutlineVerticalLeft />
            }
            variant="unstyled"
            size="sm"
            onClick={toggle}
            bg="#F3F8FF"
            color="#A0AEC0"
            fontSize="18px"
            p="0.5"
            // display={{ base: 'inline', lg: 'none' }}
          />
        </Flex>

        <Box
          // @ts-ignore
          marginStart={{
            base: "0",
            lg:
              "var(--sidebar-width)" && isOpen ? "var(--sidebar-width)" : null,
          }}
          transition={isOpen ? "0.5s" : "1s"}
          height="calc(100vh - 65px)"
          p="1rem"
          w="(calc(100% - var(--sidebar-width)"
        >
          {props.children}
        </Box>
      </Container>
    </VStack>
  );
};
