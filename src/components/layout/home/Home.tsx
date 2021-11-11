import React from "react";
import Sidebar from "../Sidebar/sidebar";
import Dashboard from "../Icons/Dashboard";
import Project from "../Icons/Project";
import VendorDetail from "../Icons/VendorDetails";
import { MenuItem } from "../Sidebar/menu-item";
import { Box, Flex, Spacer, VStack, Text, Button } from "@chakra-ui/react";
import { Progress } from "@chakra-ui/react";
import Line from "../Sidebar/line";
import Main from "../main";
import Overview from "../chart/Overview";
import PaidChart from "../chart/Chart";
import { Card } from "../card/card";
import { Dropdown } from "../Drop-down/Dropdown";

export const Home = () => {
  return (
    <>
      {/* //////////////////////////////////////////////////Sidebar///////////// */}
      <Sidebar>
        <VStack alignItems="start" spacing="20px">
          <MenuItem title="Dashboard" Icon={Dashboard} />
          <MenuItem title="Project" Icon={Project} />
          <MenuItem title="Vendor Details" Icon={VendorDetail} />
        </VStack>
        <Flex justifyContent="center" mt={10}>
          <Line />
        </Flex>
      </Sidebar>
      {/* ////////////////////////////////////////////////////////////// */}
      {/* //////////Main? */}
      {/* ////////////////////////////////////////////////////////////////////// */}
      <Main>
        <VStack>
          <Card w="100%">
            <VStack alignItems="start">
              <Button
                color="rgba(42, 180, 80, 1)"
                backgroundColor="#E7F8EC"
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
                fontWeight="300"
                fontSize="29px"
              >
                Vendor Score
              </Text>

              <Progress
                value={60}
                w="233px"
                borderRadius="2px"
                isIndeterminate
              />
            </VStack>
          </Card>
          <Text w="100%" fontSize="22px" fontWeight={700} color=" #334D6E">
            WO Status Graph
          </Text>
          <Flex justifyContent="space-evenly">
            <Card rounded="13px" w="60%" h="394px">
              <Flex mb="40px" mt="30px">
                <Text
                  color="#4F4F4F"
                  fontWeight="bold"
                  fontSize="20px"
                  lineHeight="26px"
                  ml="17px"
                >
                  OVERVIEW
                </Text>
              </Flex>
              <Overview />
            </Card>
            <Spacer />
            <Card rounded="13px" w="60%" h="394px" ml="30px">
              <Flex w="100%" mb="50px">
                <Text
                  fontSize="24px"
                  fontWeight={700}
                  w="10vw"
                  pos="relative"
                  left={73}
                  top=" 14px"
                >
                  PAID
                </Text>
                <Spacer />
                <Box pos="relative" top="25px" right={30}>
                  <Dropdown />
                </Box>
              </Flex>
              <PaidChart />
            </Card>
          </Flex>
        </VStack>
      </Main>
    </>
  );
};
