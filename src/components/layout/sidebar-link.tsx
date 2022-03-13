import React from "react";
import {
  Box,
  BoxProps,
  createIcon,
  HStack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import {} from "@chakra-ui/theme-tools";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

interface SidebarLinkProps extends BoxProps {
  icon?: React.ReactElement;
  title: string;
  pathTo: string;
}

const useCheckPathSelected = (pathTo: string) => {
  const { pathname } = useLocation();
  const isLinkSelected = pathname === pathTo || pathTo === "Dashboard";
  return { isLinkSelected };
};

const selectedLinkStyle = {
  color: "brand.500",
};

export const SidebarLink: React.FC<SidebarLinkProps> = (props) => {
  const { pathTo, title, icon = <ArrowRight />, ...rest } = props;
  const { isLinkSelected } = useCheckPathSelected(pathTo);

  const selectedLinkMode = {
    ...selectedLinkStyle,
    borderLeftColor: mode("brand.200", "brand.500"),
    bgGradient: "linear(to-r, brand.50, brand.50, transparent)",
  };

  const linkState = isLinkSelected ? selectedLinkMode : {};

  return (
    <Box
      as={Link}
      to={pathTo}
      marginEnd="2"
      fontSize="sm"
      display="block"
      px="5"
      py="1"
      borderLeft="8px solid transparent"
      cursor="pointer"
      _hover={{
        ...selectedLinkStyle,
      }}
      className="group"
      fontWeight="medium"
      {...linkState}
      {...rest}
    >
      <HStack>
        <Box _groupHover={{ opacity: 1 }} fontSize="15px">
          {icon}
        </Box>
        <Text fontSize="18px" fontWeight={400} lineHeight="28px">
          {title}
        </Text>
      </HStack>
    </Box>
  );
};

const ArrowRight = createIcon({
  viewBox: "0 0 16 16",
  path: (
    <path
      d="M3.38974 12.6633L9.42974 12.6633C9.86308 12.6633 10.2697 12.4567 10.5164 12.1033L13.1497 8.39C13.3164 8.15667 13.3164 7.85 13.1497 7.61667L10.5097 3.89667C10.2697 3.54334 9.86308 3.33667 9.42974 3.33667L3.38974 3.33667C2.84974 3.33667 2.53641 3.95667 2.84974 4.39667L5.42974 8.00334L2.84974 11.61C2.53641 12.05 2.84974 12.6633 3.38974 12.6633V12.6633Z"
      fill="currentcolor"
    />
  ),
});
