import { Box, HStack, VStack, Text, Flex } from "@chakra-ui/layout";

import { ProjectCard } from "./ProjectCard";
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
  TopIconFirst,
  TopIconSecond,
} from "../../../../Icons/ProjectIcon";
import { RepeatClockIcon } from "@chakra-ui/icons";

export const ProjectSummary = () => {
  return (
    <Flex
      boxShadow="1px 1px 12px rgb(0 0 0 /10%)"
      border="1px solid white"
      borderRadius="10px"
      bgColor="white"
      marginTop="82px"
      w={{ base: "30em", md: "50em", lg: "60em", xl: "100em" }}
      direction="column"
      h={{ base: "250px", md: "180px", lg: "206px" }}
      marginLeft={{ xl: "200px", lg: "150px", md: "80px", base: "10px" }}
      marginRight={{ md: "30%", base: "20%" }}
    >
      <Text
        h="55px"
        paddingLeft="30px"
        paddingTop="5px"
        fontSize="22px"
        fontWeight="600"
      >
        Project Summary
      </Text>

      <HStack
        p={{ sm: "0px", lg: "0px", xl: "0px 30px 0px 30px" }}
        justifyContent={{
          xl: "space-between",
          lg: "space-between",
          md: "space-between",
          base: "unset",
        }}
        display={{ xl: "flex", lg: "flex", md: "flex", base: "grid" }}
        alignItems={{ base: "center", md: "center" }}
        paddingLeft={{ md: "unset", base: "unset", lg: "15px" }}
        marginLeft="6px"
        gridTemplateColumns={{ base: " Repeat(3,1fr)" }}
        gridTemplateRows={{ base: "Repeat(3,1fr) " }}
        gridRowGap={{ base: "40px" }}
      >
        <ProjectCard
          TopIcon={TopIconFirst}
          BigIcon={SummaryIconFirst}
          number={15}
          name="Active Wo"
          color={" #FBF3DC"}
          iconColor={"#FBECED"}
        />
        <ProjectCard
          TopIcon={TopIconSecond}
          BigIcon={SummaryIconSecond}
          number={15}
          name="Past Due"
          color={"#E3F0DF"}
          iconColor={"#E7F8EC"}
        />
        <ProjectCard
          TopIcon={TopIconFirst}
          BigIcon={SummaryIconThird}
          number={18}
          name="Completed & invoiced"
          color={"#ECF2FE"}
          iconColor={"#FBECED"}
        />
        <ProjectCard
          TopIcon={TopIconSecond}
          BigIcon={SummaryIconForth}
          number={23}
          name="Completed & Not paid"
          color={" #FAE6E5"}
          iconColor={"#E7F8EC"}
        />
        <ProjectCard
          TopIcon={TopIconFirst}
          BigIcon={SummaryIconFifth}
          name="Upcoming Payments"
          color={"#ECF2FE"}
          iconColor={"#E7F8EC"}
          numbertext="$57k"
        />
      </HStack>
    </Flex>
  );
};

export default ProjectSummary;
