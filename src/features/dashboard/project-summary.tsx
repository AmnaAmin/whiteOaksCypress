import { Box, HStack, VStack, Text, Flex } from "@chakra-ui/layout";
import { ProjectCard } from "./project-card";
import SummaryIconFirst, {
  SummaryIconFifth,
  SummaryIconForth,
  SummaryIconSecond,
  SummaryIconThird,
  TopIconFirst,
  TopIconSecond,
} from "icons/project-icons";
export const ProjectSummary = () => {
  return (
    <Flex
      boxShadow="1px 0px 70px rgb(0 0 0 / 10%)"
      border="1px solid white"
      borderRadius="10px"
      bg="whiteAlpha.900"
      direction="column"
      boxSizing="border-box"
      py={{ base: "7", lg: "7" }}
      px={{ base: "3", lg: "7" }}
    >
      <Text h="55px" marginBottom="8px" fontSize="22px" fontWeight="600">
        Project Summary
      </Text>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        display="grid"
        gridTemplateColumns={{
          base: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
          lg: "repeat(3,1fr)",
          xl: "repeat(5,1fr)",
        }}
        gridRowGap={{ base: "5px" }}
      >
        <ProjectCard
          UpdownIcon={TopIconFirst}
          BigIcon={SummaryIconFirst}
          number={15}
          name="Active Wo"
          Iconbgcolor={" #FBF3DC"}
          TopnumberbgColor={"#FBECED"}
        />
        <ProjectCard
          UpdownIcon={TopIconSecond}
          BigIcon={SummaryIconSecond}
          number={15}
          name="Past Due"
          Iconbgcolor={"#E3F0DF"}
          TopnumberbgColor={"#E7F8EC"}
        />
        <ProjectCard
          UpdownIcon={TopIconFirst}
          BigIcon={SummaryIconThird}
          number={18}
          name="Completed & invoiced"
          Iconbgcolor={"#ECF2FE"}
          TopnumberbgColor={"#FBECED"}
        />
        <ProjectCard
          UpdownIcon={TopIconSecond}
          BigIcon={SummaryIconForth}
          number={23}
          name="Completed & Not paid"
          Iconbgcolor={" #FAE6E5"}
          TopnumberbgColor={"#E7F8EC"}
        />
        <ProjectCard
          UpdownIcon={TopIconFirst}
          BigIcon={SummaryIconFifth}
          name="Upcoming Payments"
          Iconbgcolor={"#ECF2FE"}
          TopnumberbgColor={"#E7F8EC"}
          numbertext="$57k"
        />
      </HStack>
    </Flex>
  );
};
export default ProjectSummary;
