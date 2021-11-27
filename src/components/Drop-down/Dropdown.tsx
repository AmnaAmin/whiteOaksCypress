import { Select } from "@chakra-ui/react";
import React from "react";

import { useState } from "react";

export const Dropdown = () => {
  const [month, setMonth] = useState("");
  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMonth(event.target.value);
    console.log(event);
  };
  return (
    <Select
      onChange={handleChange}
      value={month}
      border="none"
      background="none"
      h="20px"
    >
      <option value={0}>January</option>
      <option value={1}>February</option>
      <option value={2}>March</option>
      <option value={3}>April</option>
      <option value={4}>May</option>
      <option value={5}>June</option>
      <option value={6}>July</option>
      <option value={7}>August</option>
      <option value={8}>September</option>
      <option value={9}>October</option>
      <option value={10}>November</option>
      <option value={11}>December</option>
    </Select>
  );
};
