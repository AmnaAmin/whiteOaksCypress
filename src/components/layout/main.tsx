import { Flex } from "@chakra-ui/layout";

export const Main: React.FC = (props) => {
  return (
    <Flex
      p="15px"
      position="fixed"
      top="60px"
      left="300px"
      right="0"
      bottom="0"
      height="calc(100vh - 60px)"
      border="1px solid colors.brand.100"
      overflow="auto"
      bg="brand.100"
    >
      {props.children}
    </Flex>
  );
};
