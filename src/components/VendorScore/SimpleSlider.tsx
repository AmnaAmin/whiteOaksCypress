import React from "react";

import { Box, Text, Heading } from "@chakra-ui/react";
import { Card } from "../card/card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const SimpleSlider: React.FC<{
  heading: string;
}> = (props) => {
  return (
    <Card
      bg=" 
      #EBF8FF"
      w="100%"
      display="block"
      boxShadow="1px 1px 7px rgba(0,0,0,0.2)"
    >
      <Box w="100%">
        <Heading textAlign="start" fontWeight={700} fontSize="20px">
          {props.heading}
        </Heading>
        <Box w="100%">
          {/* <Slider {...settings}> */}
          <Box textAlign="start">
            <Text>h1</Text>
            <Text>h2</Text>
            <Text>h3</Text>
          </Box>
          {/* </Slider> */}
        </Box>
      </Box>
    </Card>
  );
};
