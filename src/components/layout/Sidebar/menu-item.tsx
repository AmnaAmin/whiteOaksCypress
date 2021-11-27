import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Link, LinkProps } from "@chakra-ui/layout";
import { transform } from "lodash";

export const MenuItem: React.FC<
  LinkProps & { Icon: React.ElementType; title: string }
> = (props) => {
  const { Icon, title, ...rest } = props;

  return (
    <Link
      // pl="19px"
      mt="27px"
      fontFamily="Poppins"
      fontStyle="normal"
      fontWeight="500"
      borderLeft="5px solid white"
      _hover={{
        transition: "0.2s ease-in",
        background:
          "linear-gradient(89.98deg, rgba(230, 241, 255, 0.61) 54.08%, rgba(230, 241, 255, 0) 94.01%)",
        borderColor: "#3182CE",
        color: "#3182CE",
      }}
      w="100%"
      h="28px"
      pb="32px"
      boxSizing="border-box"
      {...rest}
    >
      <Flex alignItems="center" h="33px">
        <Box fontSize="large">
          <Icon />
        </Box>
        <Text pl="10px" fontWeight="bold" fontFamily="sans-serif">
          {title}
        </Text>
      </Flex>
    </Link>
  );
};
