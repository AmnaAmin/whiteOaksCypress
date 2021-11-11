// import { MdBrandingWatermark } from "react-icons/md";
import { Box } from "@chakra-ui/layout";
const Sidebar: React.FC = (props) => {
  return (
    <Box
      boxShadow="1px 1px 12px rgb(0 0 0 / 10%)"
      h="calc(100% - 10%)"
      w="193px"
      position="fixed"
      left="3px"
      top="70px"
      bg="white"
      paddingLeft="10px"
    >
      {props.children}
    </Box>
  );
};
export default Sidebar;
