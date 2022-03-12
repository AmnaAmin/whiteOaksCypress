import React, { useState, useEffect } from "react";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import Slider from "react-slick";
import { Card } from "../card/card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { dateFormat } from "utils/date-time-utils";
import { chunk } from "lodash";
import { RiErrorWarningFill } from "react-icons/ri";

const isDateExpired = (date: string) => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  if (givenDate > currentDate) return "";
  return "#EC7979";
};

export const SimpleSlider: React.FC<{
  heading: string;
  data?: any[];
}> = (props) => {
  const settings = {
    dots: false,
    infinite: true,
    centerPadding: "60px",
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <GoChevronLeft color="#A3A9B4" />,
    nextArrow: <GoChevronRight color="#A3A9B4" />,
  };
  const [slider, setSlider] = useState<any[]>([]);
  useEffect(() => {
    setSlider(chunk(props.data, 3));
  }, [props.data]);
  return (
    <Card
      minH="144px"
      bg="#EBF8FF"
      w="100%"
      padding="15px 30px"
      display="block"
      boxShadow="1px 1px 7px rgba(0,0,0,0.2)"
    >
      <div>
        <Heading
          color="#4A5568"
          textAlign="start"
          fontWeight={700}
          fontSize="20px"
        >
          {props.heading}
        </Heading>
        {slider.length > 0 ? (
          <Slider {...settings}>
            {slider.map((slide, i) => (
              <Box
                key={i}
                textAlign="start"
                fontWeight={400}
                mt={3}
                color=" #4A5568"
                fontSize={16}
              >
                {slide?.map((item: any) => (
                  <SliderItem
                    key={item.title}
                    title={item.title}
                    date={item.date}
                  />
                ))}
              </Box>
            ))}
          </Slider>
        ) : (
          <Flex
            marginTop="25px"
            justifyContent="center"
            alignItems="center"
            fontSize="15px"
            fontWeight="normal"
          >
            <RiErrorWarningFill fontSize="30px" color="#718096" />
            <Text ml="10px">You dont have any {props.heading} expiration</Text>
          </Flex>
        )}
      </div>
    </Card>
  );
};

const SliderItem: React.FC<{ title: string; date: string }> = ({
  title,
  date,
}) => {
  if (!date) return null;
  return (
    <Flex
      lineHeight={1.4}
      _last={{ borderBottomWidth: 0 }}
      borderBottom="1px solid #E5E5E5"
      justifyContent="space-between"
      color={isDateExpired(date)}
      alignItems="center"
      fontSize="18px"
    >
      <Text>{title}</Text>
      <Text>{dateFormat(date)}</Text>
    </Flex>
  );
};
