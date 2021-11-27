import { Button, VStack, Text, Flex, Spacer, Box } from "@chakra-ui/react";
import React from "react";
import { Card } from "../card/card";
import Progressbar from "../Progress/progressbar";
import { ProgressData } from "../Progress/progressData";
import { SimpleSlider } from "./SimpleSlider";

const ProgressValue = [1, 5];

export const VendorScore = () => {
  return (
    <>
      <Card w={{ base: "510px", md: "100%" }} mb="22px">
        <Flex
          justifyContent="space-evenly"
          direction={{ base: "column", md: "column", lg: "column", xl: "row" }}
        >
          <VStack alignItems="start" w="401px" p="16px">
            <Button
              color="rgba(42, 180, 80, 1)"
              backgroundColor="#C6F6D5"
              width="86px"
              height="25px"
              lineHeight="16px"
              border="none"
              borderRadius="5px"
            >
              Active
            </Button>
            <Text
              fontFamily="sans-serif"
              fontStyle="normal"
              fontWeight={300}
              fontSize="29px"
            >
              Vendor Score
            </Text>
            <Flex w={{ base: "22em", md: "22em" }} alignItems="center">
              <Progressbar />
              <Spacer />
              <Box>
                <ProgressData
                  firstValue={ProgressValue[0]}
                  secondValue={ProgressValue[1]}
                />
              </Box>
            </Flex>
          </VStack>
          <Spacer />
          <Flex
            w="64%"
            justifyContent="space-between"
            direction={{
              base: "column",
              md: "row",
              lg: "row",
              xl: "row",
            }}
          >
            <Box w={{ base: "75%", md: "75%", lg: "75%", xl: "49.5%" }}>
              <SimpleSlider heading={"Insurance"} />
            </Box>
            <Box
              w={{ base: "75%", md: "75%", lg: "75%", xl: "49.5%" }}
              mt={{ base: "25px", md: 0 }}
              ml={{ base: 0, md: "30px", lg: "30px", xl: "30px" }}
            >
              <SimpleSlider heading={"License"} />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};
