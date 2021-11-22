import { Box } from "@chakra-ui/layout";
// import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
const Sidebar: React.FC = (props) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <>
      <Button onClick={onToggle} mt="15px" ml="5px" pos="fixed">
        <GiHamburgerMenu />
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        {/* <DrawerContent> */}
        <DrawerBody>
          <Box
            boxShadow="1px 1px 12px rgb(0 0 0 / 10%)"
            h="calc(100% - 100px)"
            w="193px"
            position="fixed"
            left="3px"
            top="70px"
            paddingLeft="10px"
            bg="white"
            zIndex={10}
            display={{ base: "none", md: "unset" }}
          >
            {props.children}
            {/* <DrawerCloseButton>
              <AiOutlineArrowLeft />
            </DrawerCloseButton> */}
          </Box>
        </DrawerBody>
        {/* </DrawerContent> */}
      </Drawer>
    </>
  );
};
export default Sidebar;
