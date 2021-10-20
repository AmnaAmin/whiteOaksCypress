import BarChart from "./bar-chart";
import Header from "./Header";

import { Flex } from "@chakra-ui/layout";

export default {
  title: "App-Layout",
};

export const Layout = () => {
  return (
    <>
      <Header />

      <Flex height="120vh">
        <BarChart />
      </Flex>
    </>
  );
};
