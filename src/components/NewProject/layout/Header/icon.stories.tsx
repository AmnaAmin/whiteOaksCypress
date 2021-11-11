import { BellIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";

export default {
  title: "bell-icon",
};

export const bell = () => {
  return (
    <Box bg="blue" w="50px" h="50px">
      <Box bg="red" w="10px" h="10px"></Box>
      <BellIcon fontSize="30px" />
    </Box>
  );
};
