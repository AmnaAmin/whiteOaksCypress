import React from "react";
import { Box, HStack, Text, Flex, VStack } from "@chakra-ui/react";
import Avatars from "./Avatar";
import LogoIcon from "../../../../Icons/Header-logo";
import BellIcon from "../../../../Icons/Bell-icon";
// import LenguegeDropDown from './LenguegeDropDown';

export const Header: React.FC = () => {
  return (
    <HStack
      boxShadow="1px 1px 12px rgb(0 0 0 /10%)"
      position="fixed"
      width="100%"
      h="60px"
      left={0}
      top={0}
      right={0}
      bgColor="white"
    >
      <Box>
        <LogoIcon />
      </Box>
      <Flex w="100%" justifyContent="flex-end" alignItems="center">
        {/* <VStack>
          <LenguegeDropDown />
        </VStack> */}
        <Box paddingRight="46px" _selected={{ color: "blue" }}>
          <BellIcon />
        </Box>
        <Box alignItems="center">
          <Avatars />
        </Box>
      </Flex>
    </HStack>
  );
};

// import { Flex } from "@chakra-ui/layout";

// import { Box } from "@chakra-ui/layout";
// import { FcAlarmClock } from "react-icons/fc";
// import { BsBell } from "react-icons/bs";
// import { Avatar } from "@chakra-ui/react";
// import { Wrap, WrapItem } from "@chakra-ui/react";
// import { Flex } from "@chakra-ui/layout";

// const Header: React.FC = (props) => {
//   return (
//     <Flex
//       // w="100%"
//       // h="60px"
//       // bg="white"
//       // border="1px solid gray"
//       // position="static"
//       // top="0"
//       // left="0"

//       zIndex={1}
//       bg="#FFFFFF"
//       w="100%"
//       h="70px"
//       position="fixed"
//       left="0px"
//       top="0px"
//       border="1px solid lightgray"
//       p="10px"
//       boxShadow="1px 0px 4px 1px grey"
//       borderRadius="4px"
//     >
//       {/* ///////////////////////////////logo start */}
//       <Box minW="fit-content" display="flex" p="10px">
//         <Box display="flex" fontSize="large">
//           <Box p="5px">{<FcAlarmClock />}</Box>
//           <Box fontWeight="bold">WhiteOaks</Box>
//         </Box>
//       </Box>
//       {/* /////////////////////// logo end */}

//       <Box w="100%" display="flex" justifyContent="flex-end" p="6px" h="60px">
//         <Wrap
//           minW="fit-content"
//           justifyContent="space-evenly"
//           display="flex"
//           p={[10, 10, 0, 0]}
//           mr={40}
//           fontSize="large"
//           color="#757F9A"
//           alignItems="center"
//         >
//           <WrapItem px="20px">Help</WrapItem>
//           <WrapItem px="20px">Support</WrapItem>
//           <WrapItem px="20px">English</WrapItem>
//           <WrapItem px="20px" p="5.5px">
//             <BsBell color="gray.100" />
//           </WrapItem>

//           <WrapItem px="20px" display="flex" alignItems="center">
//             <Avatar
//               size="xs"
//               name="Christian Nwamba"
//               src="https://bit.ly/code-beast"
//               borderRadius="50%"
//               _hover={{
//                 boxShadow: "1px 0px 4px 1px grey;",
//               }}
//               h="40px"
//             />
//             <text style={{ paddingLeft: "10px", fontWeight: "bolder" }}>
//               Dan Abrahmov
//             </text>
//           </WrapItem>
//         </Wrap>
//       </Box>
//     </Flex>
//   );
// };

// export default Header;
