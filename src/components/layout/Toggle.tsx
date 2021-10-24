import React from "react";
import { Box } from "@chakra-ui/layout";
import { MdBrandingWatermark } from "react-icons/md";
import { Fade, ScaleFade, Slide, SlideFade, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

const Toggle = () => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Button onClick={onToggle} border="black" bg="white" color="#8E0E00">
        <MdBrandingWatermark
          style={{
            // paddingInlineStart: "4px",
            position: "relative",
            left: "8px",
            paddingInline: "16px",
          }}
        />{" "}
        Administration
      </Button>
      <Fade in={isOpen}>
        <Box color="black" mt="4" bg="teal.500" rounded="md" shadow="md">
          <ul className="parent_ul_second">
            <li style={{}}>User Management</li>
            <li>Markets</li>
            <li>Vendor Skills</li>
          </ul>
        </Box>
      </Fade>
    </>
  );
};

export default Toggle;

// {
//   <Accordion defaultIndex={[0]} allowMultiple>
//     <AccordionItem>
//       <h2>
//         <AccordionButton border="black" bg="white">
//           <Box flex="1" textAlign="left" p="4px" color="#8E0E00">
//             <MdBrandingWatermark
//               style={{
//                 padding: "3px",
//                 position: "relative",
//                 top: "5px",
//                 color: "#8E0E00",
//               }}
//             />{" "}
//             Administration
//           </Box>
//           <AccordionIcon />
//         </AccordionButton>
//       </h2>
//       <AccordionPanel pb={4}>
//         <ul className="parent_ul_second">
//           <li style={{}}>User Management</li>
//           <li>Markets</li>
//           <li>Vendor Skills</li>
//         </ul>
//       </AccordionPanel>
//     </AccordionItem>
//   </Accordion>;
// }
