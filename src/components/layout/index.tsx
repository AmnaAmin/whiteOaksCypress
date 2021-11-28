import {
  Box,
  Container,
  Flex,
  Text,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { SidebarLink } from "./sidebar-link";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { BsHddStack } from "react-icons/bs";
import { useMobileMenuState } from "utils/hooks/useMobileMenuState";

type LayoutProps = {
  pageContents?: React.ReactNode;
};
export const Layout: React.FC<LayoutProps> = (props) => {
  const { pageContents = <Text>Page Contents goes here...</Text> } = props;

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
        sx={{ "--sidebar-width": "12rem" }}
      >
        <Flex
          bg={mode("white", "black")}
          position="fixed"
          top="60px"
          bottom="0"
          left={isOpen ? "0" : "calc((var(--sidebar-width)+100) * -1)"}
          transition="all 0.5s ease-in-out"
          boxShadow={isOpen ? "xl" : "0"}
          zIndex="dropdown"
        >
          <Box
            as="nav"
            display="block"
            flex="1"
            width="var(--sidebar-width)"
            py="5"
          >
            <Box fontSize="sm" lineHeight="short">
              <Sidebar>
                <SidebarLink
                  pathTo="/"
                  title="Dashboard"
                  icon={<MdOutlineDashboard />}
                />
                <SidebarLink
                  pathTo="/projects"
                  title="Projects"
                  icon={<BsHddStack />}
                />
                <SidebarLink
                  pathTo="/vendors"
                  title="Vendor"
                  icon={<FaRegUser />}
                />
              </Sidebar>
            </Box>
          </Box>
        </Flex>

        <Box
          marginStart={{ base: "0", lg: "var(--sidebar-width)" }}
          height="calc(100vh - 65px)"
          p="1rem"
          w="(calc(100% - var(--sidebar-width)"
        >
          {pageContents}
        </Box>
      </Container>
    </VStack>
  );
};
