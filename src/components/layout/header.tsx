import { Flex } from "@chakra-ui/layout";

export const Header: React.FC = (props) => {
  return (
    <Flex
      w="100%"
      h="60px"
      bg="white"
      border="1px solid gray"
      position="fixed"
      top="0"
      left="0"
    >
      {props.children}
    </Flex>
  );
};
