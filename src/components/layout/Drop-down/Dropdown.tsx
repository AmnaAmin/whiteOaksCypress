// // import * as React from 'react';
// // import { Box } from '@mui/material/Box';
// // import { InputLabel } from '@mui/material/InputLabel';
// // import { MenuItem } from '@mui/material/MenuItem';
// // import { FormControl } from '@mui/material/FormControl';
// // import { Select } from '@mui/material/Select';

// import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
// import React from 'react';
// import { useState } from 'react-router/node_modules/@types/react';

// export const Dropdown = () => {
//   const [month, setMonth] = useState('');

//   const handleChange = event => {
//     setMonth(event.target.value);
//     // console.log(event);
//   };
//   return (
//     <>
//       <FormControl fullWidth>
//         <InputLabel id="demo-simple-select-label">Age</InputLabel>
//         <Select labelId="demo-simple-select-label" id="demo-simple-select" value={month} label="Age" onChange={handleChange}>
//           <MenuItem value={0}>Jan</MenuItem>
//           <MenuItem value={1}>Feb</MenuItem>
//           <MenuItem value={2}>Mar</MenuItem>
//           <MenuItem value={3}>Apr</MenuItem>
//           <MenuItem value={4}>May</MenuItem>
//           <MenuItem value={5}>Jun</MenuItem>
//           <MenuItem value={6}>July</MenuItem>
//           <MenuItem value={7}>Aug</MenuItem>
//           <MenuItem value={8}>Sep</MenuItem>
//           <MenuItem value={9}>Oct</MenuItem>
//           <MenuItem value={10}>Nov</MenuItem>
//           <MenuItem value={11}>Dec</MenuItem>
//         </Select>
//       </FormControl>
//     </>
//   );
// };

// // export default function BasicSelect() {
// //   const [age, setAge] = React.useState('');

// //   const handleChange = event => {
// //     setAge(event.target.value);
// //     console.log(event);
// //   };

// //   return (
// //     <Box sx={{ minWidth: 120 }}>
// //       <FormControl fullWidth>
// //         <InputLabel id="demo-simple-select-label">Months</InputLabel>
// //         <Select labelId="demo-simple-select-label" id="demo-simple-select" value={age} label="Age" onChange={handleChange}>
// //           <MenuItem value={0}>Jan</MenuItem>
// //           <MenuItem value={1}>Feb</MenuItem>
// //           <MenuItem value={2}>Mar</MenuItem>
// //           <MenuItem value={3}>Apr</MenuItem>
// //           <MenuItem value={4}>May</MenuItem>
// //           <MenuItem value={5}>Jun</MenuItem>
// //         </Select>
// //       </FormControl>
// //     </Box>
// //   );
// // }
// import React from 'react';
// import { Select } from '@chakra-ui/select';

// export const Dropdown = () => {
//   return (
//     <Select placeholder="Months">
//       <option value="option1">Option 1</option>
//       <option value="option2">Option 2</option>
//       <option value="option3">Option 3</option>
//     </Select>
//   );
// };

import { Box, Select } from "@chakra-ui/react";
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
