import { Flex } from "@chakra-ui/layout";

import React, { useState } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
} from "recharts";

const data = [
  {
    name: "Jan",
    uv: 4000,
    pv: 800,
    // amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 2000,
    // amt: 2210,
  },
  {
    name: "Mar",
    uv: 2000,
    pv: 1500,
    // amt: 2290,
  },
  {
    name: "Apr",
    uv: 2780,
    pv: 400,

    // amt: 2000,
  },

  {
    name: "May",
    uv: 2390,
    pv: 1750,
    fill: " #fffc00",
    // amt: 2500,
  },
  {
    name: "Jun",
    uv: 3490,
    pv: 850,
    // amt: 2100,
  },
  {
    name: "Jul",
    uv: 3490,
    pv: 250,
    // amt: 2100,
  },
  {
    name: "Aug",
    uv: 3490,
    pv: 1350,
    // amt: 2100,
  },
  {
    name: "Sep",
    uv: 3490,
    pv: 700,
    // amt: 2100,
  },
  {
    name: "Oct",
    uv: 3490,
    pv: 2300,
    // amt: 2100,
  },
  {
    name: "Nov",
    uv: 3490,
    pv: 1000,
    // amt: 2100,
  },
];
const BarDefaultColors = {
  top: "#8E0E00",
  bottom: "#979AC2",
};

export const Main: React.FC = (props) => {
  const [focusBarIndex, setFocusBarIndex] = useState(null);
  return (
    <Flex
      h="70vh"
      p="10px"
      // bg="white"
      position="relative"
      top="60px"
      left="230px"
      right="0"
      bottom="0"
      border="1px solid colors.brand.100"
    >
      {/* zIndex={1}
      position="relative"
      right="0"
      top="60px"
      left="350px"
      bottom="0"
      p="20px"
      overflow="auto"
      h="calc(100vh - 60px)" */}

      <ReBarChart
        width={900}
        height={400}
        style={{ backgroundColor: "white" }}
        data={data}
        onMouseMove={(state) => {
          if (state.isTooltipActive) {
            setFocusBarIndex(state.activeTooltipIndex);
          } else {
            setFocusBarIndex(null);
          }
        }}
      >
        <XAxis dataKey="name" />
        1000
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <defs>
          <linearGradient
            id={`bar-color`}
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={BarDefaultColors.top} />
            <stop offset="1" stopColor={BarDefaultColors.bottom} />
          </linearGradient>

          <linearGradient
            id={`bar-hover`}
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={"yellow"} />
            <stop offset="1" stopColor={"yellow"} />
          </linearGradient>
        </defs>
        <Bar dataKey="pv" barSize={40} radius={[20, 20, 0, 0]}>
          {data.map((entry, index) => {
            const isFocused = focusBarIndex === index;
            return (
              <>
                <Cell
                  key={`cell-${index}`}
                  fill={isFocused ? `url(#bar-hover)` : `url(#bar-color)`}
                />
              </>
            );
          })}
        </Bar>
      </ReBarChart>
    </Flex>
  );
};
