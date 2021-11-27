import React from "react";
import { Box, Flex, Spacer, VStack, Text } from "@chakra-ui/react";

import Overview from "../chart/Overview";
import PaidChart from "../chart/Chart";
import { Card } from "../card/card";

import Main from "../layout/main";
import Sidebar from "../layout/Sidebar/sidebar";
import { Header } from "../NewProject/layout/Header/Header";
import { ProjectSummary } from "../NewProject/layout/ProjectSummary/ProjectSummary";
import { Dropdown } from "../Drop-down/Dropdown";
import { VendorScore } from "../VendorScore/vendorScore";

export const Home = () => {
  return (
    <Box>
      <Box>
        <Header />
      </Box>

      {/* ///////////////////////////////////// Sidebar start*/}
      <Sidebar />
      {/* /////////////////////////////////   Sidebar end*/}

      <Main>
        <VStack w={{ base: " 644px", md: "100%", lg: "100%" }} zIndex={2}>
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////  card vendor score start*/}
          <VendorScore />
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////// card vendor score end */}

          {/* /////////////////////////////////////////////////////////////////////////////// */}
          {/* ////////////////////////////////////////////////// Project summary start*/}
          <Box w={{ base: "510px", md: "100%" }}>
            <ProjectSummary />
          </Box>
          {/* ////////////////////////////////////////////// project summary end */}
          {/* /////////////////////////////////////////////////////////////////////////////  text wo status graph start*/}
          <Box w={{ base: "509px", md: "100%" }}>
            <Text
              fontSize="22px"
              fontWeight={700}
              paddingInlineStart="14px"
              mb="5px"
            >
              WO Status Graph
            </Text>
          </Box>
          {/* ///////////////////////////////////////////////////////////////////////////////text WO status graph end*/}
          {/* ////////////////////////////////////// */}
          {/* ///////////////////////////////////////////// */}
          {/* /////////////////////////////////////////////////// */}
          <Flex
            direction={{
              base: "column",
              md: "column",
              lg: "column",
              xl: "row",
            }}
            w={{ base: "510px", md: "100%" }}
          >
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Overview Chart start*/}
            <Card
              rounded="13px"
              w={{
                base: "500px",
                md: "100%",
                lg: "100%",
              }}
            >
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
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Overview Chart end */}
            {/* //////////////////////////// */}
            {/* ///////////////////////////////////////////// */}
            <Spacer />
            {/* ///////////////////////////////////////////// */}
            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Paid Chart start */}
            <Card
              rounded="13px"
              w={{
                base: "500px",
                md: "100%",
              }}
              ml={{ base: 0, md: 0, lg: 0, xl: "30px" }}
              mt={{ base: "30px", md: "30px", lg: "30px", xl: 0 }}
            >
              <Flex w="100%" mb="50px">
                <Text
                  fontSize="24px"
                  fontWeight={700}
                  w="10vw"
                  pos="relative"
                  left={73}
                  top=" 14px"
                  width={["80px", "80px", "80px", "80px"]}
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
            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Paid Chart end/////// */}
          </Flex>
          {/* //////////////////// */}
          {/* ///////////////////////////////////////////// */}
        </VStack>
      </Main>
    </Box>
  );
};
