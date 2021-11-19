import React from "react";
import Sidebar from "../Sidebar/sidebar";
import { MenuItem } from "../Sidebar/menu-item";
import {
  Box,
  Flex,
  Spacer,
  VStack,
  Text,
  Button,
  HStack,
  SimpleGrid,
  Container,
  Stack,
} from "@chakra-ui/react";
import { Progress } from "@chakra-ui/react";
import Line from "../Sidebar/line";
import Main from "../main";
import Overview from "../chart/Overview";
import PaidChart from "../chart/Chart";
import { Card } from "../card/card";
import { Dropdown } from "../Drop-down/Dropdown";
import { ProgressData } from "../Progress/progressData";
import Progressbar from "../Progress/progressbar";
import {
  MdOutlineDashboard,
  MdOutlineViewAgenda,
  MdPersonOutline,
} from "react-icons/md";

const ProgressValue = [12, 5];

export const Home = () => {
  return (
    <>
      <Sidebar>
        <VStack alignItems="start" spacing="20px">
          <MenuItem title="Dashboard" Icon={MdOutlineDashboard} />
          <MenuItem title="Project" Icon={MdOutlineViewAgenda} />
          <MenuItem title="Vendor Details" Icon={MdPersonOutline} />
        </VStack>
        <Flex justifyContent="center" mt={10}>
          <Line />
        </Flex>
      </Sidebar>

      <Main>
        <VStack w="100%">
          {/* ///////////////////////////////////////////////////////////////////////  card vendor score */}
          <Card w={{ base: "510px", md: "100%" }} border="1px dotted green">
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
                fontWeight={300}
                fontSize="29px"
              >
                Vendor Score
              </Text>
              <Flex w="22em">
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
          </Card>
          {/* //////////////////////////////////////////////////////////////////////////////////////////  text wo status graph*/}
          <Box w={{ base: "200px", md: "100%" }}>
            <Text
              fontSize="22px"
              fontWeight={700}
              paddingInlineStart="14px"
              border="1px solid blue"
            >
              WO Status Graph
            </Text>
          </Box>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// charts overview and paid */}
          <Flex
            border="1px solid pink"
            direction={{ base: "column", md: "column", lg: "row" }}
            w={{ base: "510px", md: "100%" }}
          >
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
            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////// ////////////////////////////  */}
            <Spacer />
            <Card
              rounded="13px"
              w={{
                base: "500px",
                md: "100%",
                lg: "100%",
              }}
              ml={{ base: "0px", md: "0px", lg: "30px" }}
              mt={{ base: "30px", md: "30px", lg: "0px" }}
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
            {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          </Flex>
          {/* /////////////////////////////////////////////////////////////////////////////////////////////// */}
        </VStack>
      </Main>
    </>
  );
};
