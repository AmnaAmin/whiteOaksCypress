import { Flex } from "@chakra-ui/layout";

export const Sidebar: React.FC = (props) => {
  return (
    <Flex
      border="1px solid gray"
      w="300px"
      h="calc(100vh - 60px)"
      position="fixed"
      left="0"
      top="60px"
      bg="blue.200"
    >
      {props.children}
    </Flex>
  );
};
