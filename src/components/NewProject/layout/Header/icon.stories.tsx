import { BellIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import Dropdown from "./DropDown";

export default {
  title: "bell-icon",
};

export const bell = () => {
  return (
    <Box
      bg="lightblue"
      h="60px"
      borderRadius="50px"
      w="60px"
      alignItems="center"
    >
      <Box bg="red" w="10px" h="10px"></Box>
      <BellIcon fontSize="30px" />

      {/* <Box>
        <Dropdown />
      </Box> */}
    </Box>
  );
};
