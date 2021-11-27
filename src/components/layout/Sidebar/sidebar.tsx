import { Box } from "@chakra-ui/layout";
// import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
// import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { RiLayoutColumnLine, RiCalendarFill } from "react-icons/ri";
import { VStack } from "@chakra-ui/react";
import { MenuItem } from "./menu-item";
const Sidebar: React.FC = (props) => {
  // const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <>
      {/* <Button onClick={onToggle} mt="55px" ml="5px" pos="fixed">
        <GiHamburgerMenu />
      </Button> */}
      {/* <Drawer isOpen={isOpen} placement="left" onClose={onClose}> */}
      {/* <DrawerContent> */}
      {/* <DrawerBody> */}
      <Box
        boxShadow="1px 1px 12px rgb(0 0 0 / 10%)"
        h="calc(100% - 10%)"
        w="207px"
        position="fixed"
        left="3px"
        top="76px"
        bg="white"
        paddingLeft="3px"
        display={{ base: "none", md: "unset" }}
        zIndex={6}
      >
        <VStack alignItems="start" spacing="20px">
          <MenuItem title="Dashboard" Icon={RiCalendarFill} />
          <MenuItem title="Project" Icon={RiLayoutColumnLine} />
          <MenuItem title="Vendor Details" Icon={FaUser} />
        </VStack>
        {/* <DrawerCloseButton>
                <AiOutlineArrowLeft />
              </DrawerCloseButton> */}
      </Box>
      {/* </DrawerBody> */}
      {/* </DrawerContent> */}
      {/* </Drawer> */}
    </>
  );
};
export default Sidebar;
