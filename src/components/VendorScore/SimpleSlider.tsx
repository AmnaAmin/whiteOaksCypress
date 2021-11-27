import React from "react";

import { Box, Text, Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import { Card } from "../card/card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const SimpleSlider: React.FC<{
  heading: string;
}> = (props) => {
  const settings = {
    // dots: true,
    infinite: true,
    // centerMode: true,
    centerPadding: "60px",
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Card
      bg=" 
      #EBF8FF"
      w={{ base: "30em", md: "100%", lg: "100%", xl: "95%" }}
      boxShadow="1px 1px 7px rgba(0,0,0,0.2)"
    >
      <Box>
        <Heading textAlign="start" fontWeight={700} fontSize="20px">
          {props.heading}
        </Heading>
        <Slider {...settings}>
          <Box textAlign="start">
            <Text>h1</Text>
            <Text>h2</Text>
            <Text>h3</Text>
          </Box>
          <Box textAlign="start">
            <Text>h1</Text>
            <Text>h2</Text>
            <Text>h3</Text>
          </Box>
        </Slider>
      </Box>
    </Card>
  );
};
