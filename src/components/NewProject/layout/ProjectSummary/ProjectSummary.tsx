import { HStack, Text, Flex } from "@chakra-ui/layout";
import { ProjectCard } from "./ProjectCard";
//
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
  TopIconFirst,
  TopIconSecond,
} from "../../../../Icons/ProjectIcon";

export const ProjectSummary = () => {
  return (
    <Flex
      boxShadow="1px 0px 70px rgb(0 0 0 / 10%)"
      // boxShadow="1px 1px 12px rgba(0,0,0,0.2)"
      border="1px solid white"
      borderRadius="10px"
      bgColor={{ base: "unset", md: "white" }}
      direction="column"
      h={{ base: "auto", md: "196px" }}
      // marginLeft={{ base: "1%", md: "1%", lg: "200px", xl: "300px" }}
      boxSizing="border-box"
      mb="10px"
    >
      <Text
        h="38px"
        paddingLeft={{ base: "40px", md: "30px" }}
        marginTop="15px"
        marginBottom="8px"
        fontSize="22px"
        fontWeight="600"
      >
        Project Summary
      </Text>
      <HStack
        p="0px 30px 0px 30px"
        justifyContent="space-between"
        display={{ base: "grid", md: "flex" }}
        alignItems="center"
        paddingLeft="15px"
        marginLeft="6px"
        gridTemplateColumns={{ base: " Repeat(2,1fr)" }}
        gridTemplateRows={{ base: "Repeat(3,1fr) " }}
        gridRowGap={{ base: "10px" }}
      >
        <ProjectCard
          TopIcon={TopIconFirst}
          BigIcon={SummaryIconFirst}
          number={15}
          name="Active Wo"
          color={"#EDF2F7"}
          iconColor={"#FED7D7"}
        />
        <ProjectCard
          TopIcon={TopIconSecond}
          BigIcon={SummaryIconSecond}
          number={15}
          name="Past Due"
          color={"#EBF8FF"}
          iconColor={"#C6F6D5"}
        />
        <ProjectCard
          TopIcon={TopIconFirst}
          BigIcon={SummaryIconThird}
          number={18}
          name="Completed & invoiced"
          color={"#FAF5FF"}
          iconColor={"#FED7D7"}
        />
        <ProjectCard
          TopIcon={TopIconSecond}
          BigIcon={SummaryIconForth}
          number={23}
          name="Completed & not paid"
          color={" #FFF5F5"}
          iconColor={"#C6F6D5"}
        />
        <ProjectCard
          TopIcon={TopIconFirst}
          BigIcon={SummaryIconFifth}
          name="Upcoming Payments"
          color={" #F0FFF4"}
          iconColor={"#C6F6D5"}
          numbertext="$57k"
        />
      </HStack>
    </Flex>
  );
};
export default ProjectSummary;
