import { Box, Wrap, WrapItem } from "@chakra-ui/layout";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { RiUser3Line } from "react-icons/ri";
import { FiMessageSquare } from "react-icons/fi";
import { RiProjectorFill } from "react-icons/ri";
// import { MdBrandingWatermark } from "react-icons/md";
import Toggle from "./Toggle";
const Sidebar: React.FC = (props) => {
  return (
    <Box
      w="340px"
      boxShadow="1px 1px 12px rgb(0 0 0 / 10%)"
      h="537px"
      position="fixed"
      left="3px"
      top="70px"
      bg="white"
      paddingLeft="10px"
      color="#8e9eab"
    >
      <ul className="parent_ul_first">
        <li>
          <MdOutlineDashboard color="#bdc3c7" className="icon_box" /> Dashboard
        </li>
        <li>
          <RiProjectorFill color="#bdc3c7" className="icon_box " />
          Projects
        </li>
        <li>
          <AiOutlineMail color="#bdc3c7" className="icon_box" />
          Payable
        </li>
        <li>
          <RiUser3Line color="#bdc3c7" className="icon_box" />
          Receivable
        </li>
        <li>
          <FiMessageSquare color="#bdc3c7" className="icon_box" />
          Alerts
        </li>
      </ul>
      <Box className="Toggle_btn">
        <Toggle />
      </Box>
    </Box>
  );
};
export default Sidebar;
