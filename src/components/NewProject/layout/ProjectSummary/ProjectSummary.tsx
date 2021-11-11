import { Box, HStack, VStack, Text } from "@chakra-ui/layout";

import { ProjectCard } from "./ProjectCard";
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
    <Box
      boxShadow="1px 1px 12px rgb(0 0 0 /10%)"
      border="1px solid white"
      borderRadius="10px"
      h="206px"
      bgColor="white"
      marginTop="82px"
    >
      <HStack
        h="55px"
        paddingLeft="30px"
        paddingTop="5px"
        fontSize="22px"
        fontWeight="600"
      >
        <Text>Project Summary</Text>
      </HStack>
      <HStack
        spacing={20}
        padding="0px 30px 0px 30px"
        justifyContent="space-between"
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
    </Box>
  );
};

export default ProjectSummary;
