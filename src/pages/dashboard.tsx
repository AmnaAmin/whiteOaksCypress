import React from "react";
import { Box, Flex, Spacer, VStack, Text } from "@chakra-ui/react";

import Overview from "components/chart/Overview";
import PaidChart from "components/chart/paid-chart";
import { Card } from "components/card/card";
import { Layout } from "components/layout";
import ProjectSummary from "features/dashboard/project-summary";

// import Main from "components/layout";
// import Sidebar from "../layout/Sidebar/sidebar";
// import { Header } from "../layout/Header/Header";
// import { ProjectSummary } from "../layout/ProjectSummary/ProjectSummary";
// import { Dropdown } from "../Drop-down/Dropdown";
import { VendorScore } from "components/VendorScore/vendor-score";
import { Dropdown } from "components/dropdown-menu/Dropdown";

export const Dashboard = () => {
  return (
    <Layout
      pageContents={
        <Box>
          <>
            <VStack w="100%" zIndex={2}>
              <Box w={{ base: "100%" }}>
                <VendorScore />
              </Box>

              <Box w="100%">
                <ProjectSummary />
              </Box>

              <Box w="100%">
                <Text
                  fontSize="22px"
                  fontWeight={700}
                  paddingInlineStart="14px"
                  mb="5px"
                >
                  WO Status Graph
                </Text>
              </Box>

              <Flex
                direction={{
                  base: "column",
                  md: "column",
                  lg: "column",
                  xl: "row",
                }}
                w="100%"
              >
                <Card rounded="13px" w="100%">
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

                <Card
                  rounded="13px"
                  w="100%"
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
              </Flex>
            </VStack>
          </>
        </Box>
      }
    />
  );
};
