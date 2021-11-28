import { Routes, Route, RouteProps } from "react-router-dom";
import { Box, Grid, useColorModeValue as mode } from "@chakra-ui/react";
import { CardWithAddButton } from "components/charkra-pro-components/Cards/CardWithAddButton";
import { Header } from "components/layout/header";
import { Layout } from "components/layout";

import { Link } from "react-router-dom";

export const Examples = ({ path }: RouteProps) => {
  return (
    <>
      <Box py="3" bg={mode("white", "gray.300")} boxShadow="base">
        <Grid gridTemplateColumns="repeat(10, 1fr)" gridGap="1">
          <Link to="header">Header</Link>
          <Link to="cards">Cards</Link>
          <Link to="layout">Layout</Link>
        </Grid>
      </Box>

      <Box my="0" bg={mode("white", "gray.300")}>
        <Routes>
          <Route path="header" element={<Header />} />
          <Route path="cards" element={<CardWithAddButton />} />
          <Route path="layout" element={<Layout />} />
          {/* <Route path="about" element={<About />} /> */}
        </Routes>
      </Box>
    </>
  );
};
