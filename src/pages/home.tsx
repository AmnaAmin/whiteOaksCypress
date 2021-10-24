import { Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import { AiOutlineFileText, AiOutlineFileExclamation } from "react-icons/ai";
import { BiDollarCircle, BiCheckSquare } from "react-icons/bi";
import { HiOutlineCalendar } from "react-icons/hi";
import { ImFileText } from "react-icons/im";
import { MdOutlineFactCheck } from "react-icons/md";
import { Card } from "../components/card/card";
import ColumnChart from "../components/column-chart/column-chart";
import Header from "../components/layout/header";
import Main from "../components/layout/main";
import Sidebar from "../components/layout/sidebar";
import { Tile } from "../components/tile/tile";

export const Home = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Main>
        <VStack>
          <Card>
            <ColumnChart />
          </Card>

          <Flex direction="column">
            <Text fontWeight="bold">Project Overview</Text>
            <HStack>
              <Card p="10px">
                <Tile name="NEW" num={5} IconElement={AiOutlineFileText} />
              </Card>
              <Card p="10px">
                <Tile name="ACTIVE" num={12} IconElement={MdOutlineFactCheck} />
              </Card>
              <Card p="10px">
                <Tile
                  name="PUNCHED"
                  num={8}
                  IconElement={AiOutlineFileExclamation}
                />
              </Card>
              <Card p="10px">
                <Tile name="CLOSED" num={25} IconElement={BiCheckSquare} />
              </Card>
              <Card p="10px">
                <Tile name="INVOICED" num={9} IconElement={ImFileText} />
              </Card>
              <Card p="10px">
                <Tile name="PAST DUE" num={3} IconElement={HiOutlineCalendar} />
              </Card>
              <Card p="10px">
                <Tile name="CLIENT PAID" num={6} IconElement={BiDollarCircle} />
              </Card>
            </HStack>
          </Flex>
        </VStack>
      </Main>
    </>
  );
};
