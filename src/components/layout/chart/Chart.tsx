import { number } from "prop-types";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "ID41",
    uv: 2000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "ID42",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "ID43",
    uv: 500,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "ID44",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "ID45",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "ID46",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "ID47",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const PaidChart: React.FC = () => {
  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="rgba(78, 135, 248, 0.3)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="rgba(78, 135, 248, 0.003)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            padding={{ left: 10 }}
            width={0}
          />
          <YAxis hide={false} type="number" axisLine={false} tickLine={false} />

          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default PaidChart;
