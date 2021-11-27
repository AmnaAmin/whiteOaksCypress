// import { fas } from '@fortawesome/free-solid-svg-icons';
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jun",
    Active: 100,
    Closed: 100,
    Paid: 0,
    Canceled: 0,
  },
  {
    name: "Jul",
    Active: 2000,
    Closed: 2400,
    Paid: 0,
    Canceled: 0,
  },
  {
    name: " Aug",
    Active: 1800,
    Closed: 0,
    Paid: 2400,
    Canceled: 0,
  },
  {
    name: " Sep",
    Active: 1100,
    Closed: 2400,
    Paid: 0,
    Canceled: 400,
  },
  {
    name: " Oct",
    Active: 4000,
    Closed: 100,
    Paid: 2400,
    Canceled: 400,
  },
  {
    name: " Nov",
    Active: 100,
    Closed: 2400,
    Paid: 2400,
    Canceled: 400,
  },
  {
    name: " Dec",
    Active: 4000,
    Closed: 2400,
    Paid: 2400,
    Canceled: 400,
  },
  {
    name: "Jan",
    Active: 4000,
    Closed: 2400,
    Paid: 2400,
    Canceled: 400,
  },
];

const Overview = () => {
  return (
    <ResponsiveContainer width="90%" height={350}>
      <BarChart data={data} barGap={"50%"} barSize={100}>
        <CartesianGrid stroke="#EFF3F9" />
        <XAxis dataKey="name" height={60} />
        <YAxis />
        <Tooltip />
        <Legend
          // wrapperStyle={{ bottom: "393px" }}
          iconType="circle"
          iconSize={10}
          margin={{ left: 20 }}
        />
        <Bar dataKey="Active" fill="#68B8EF" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Closed" fill="#FB8832" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Paid" fill="#949AC2" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Canceled" fill="#F7685B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
