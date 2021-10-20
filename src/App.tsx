import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./components/layout/header";
import { Sidebar } from "./components/layout/sidebar";
import { Main } from "./components/layout/main";
import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Header>Page Header</Header>
      <Sidebar>Page Side bar</Sidebar>
      <Main>
        <Flex height="200vh" w="100%" bg="blue.100">
          Contents
        </Flex>
      </Main>
    </>
  );
}

export default App;
