import { Box } from "@chakra-ui/layout";
import { Header } from "../components/NewProject/layout/Header/Header";
import ProjectSummary from "../components/NewProject/layout/ProjectSummary/ProjectSummary";

export const Home = () => {
  return (
    <>
      <Box>
        <Header />
        <Box marginLeft="220px" w="1600px">
          <ProjectSummary />
        </Box>
      </Box>
    </>
  );
};

export default Home;
