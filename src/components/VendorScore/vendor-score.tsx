import {
  VStack,
  Text,
  Flex,
  Spacer,
  Box,
  Tag,
  Progress,
} from "@chakra-ui/react";
import React from "react";
import { Card } from "../card/card";
import { ProgressData } from "../Progress/progressData";
import { SimpleSlider } from "./SimpleSlider";

const ProgressValue = [1, 5];

export const VendorScore = () => {
  return (
    <>
      <Card w="100%" mb="22px">
        <Box
          justifyContent="space-evenly"
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "1fr", lg: "1fr 2fr" }}
          alignItems="end"
        >
          <VStack py="4" alignItems="start">
            <Tag size="md" color="green.500" bg="green.100">
              Active
            </Tag>
            <Text fontSize="22px">Vendor Score</Text>
            <Flex alignItems="center" w="100%">
              <Box flex="1" maxW="200px" mr="10px">
                <Progress value={60} borderRadius="2px" />
              </Box>

              <Box w="100px">
                <ProgressData
                  firstValue={ProgressValue[0]}
                  secondValue={ProgressValue[1]}
                />
              </Box>
            </Flex>
          </VStack>

          <Flex
            w="100%"
            justifyContent="space-between"
            direction={{
              base: "column",
              md: "row",
            }}
          >
            <Box
              flex="1"
              mr={{ base: "0", md: "15px" }}
              mb={{ base: "15px", md: "0" }}
            >
              <SimpleSlider heading={"Insurance"} />
            </Box>
            <Box flex="1">
              <SimpleSlider heading={"License"} />
            </Box>
          </Flex>
        </Box>
      </Card>
    </>
  );
};
