import { Box } from "@chakra-ui/layout";
import { Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
} from "recharts";
import { Card } from "../components/layout/card/card";
import PaidChart from "../components/layout/chart/Chart";
import Overview from "../components/layout/chart/Overview";
import { Dropdown } from "../components/layout/Drop-down/Dropdown";

export const Charts = () => {
  return (
    <Flex
      border="1px solid pink"
      // direction={{ base: "column", md: "column", lg: "row" }}
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
      {/* /////////////////////////////////////////////////////////////////////////////////////////////////////// ////////////////////////////  */}
      <Spacer />
      <Card
        rounded="13px"
        w="100%"
        // ml={{ base: "0px", md: "0px", lg: "30px" }}
        // mt={{ base: "30px", md: "30px", lg: "0px" }}
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
  );
};

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

// export const Charts = () => {
//   return (
//     <Box border="1px" w="50%" h="100%" m="50px">
//       <ResponsiveContainer width="100%" height="80%">
//         <AreaChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
//         >
//           <XAxis dataKey="name" />
//           <YAxis />
//           <CartesianGrid strokeDasharray="3 3" />
//           <Tooltip />
//           <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
//           <ReferenceLine
//             y={4000}
//             label="Max"
//             stroke="red"
//             strokeDasharray="3 3"
//           />
//           <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
//         </AreaChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };
