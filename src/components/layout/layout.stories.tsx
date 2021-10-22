import { Box } from "@chakra-ui/layout";
import { background } from "@chakra-ui/styled-system";
import { Header } from "./header";
import { Main } from "./main";
import { Sidebar } from "./sidebar";
import { Tabchild } from "./Tabchild";
// import { Par } from "./Par";

export default { title: "Layout" };

export const LayoutStory = () => {
  return (
    <Box
      className="hello"
      style={{
        overflow: "hidden",
        background: "#DBDBDB",
        width: "100%",
        backgroundSize: "cover",
      }}
    >
      <Header>Page Header</Header>
      <Sidebar>Page Side bar</Sidebar>
      <Main></Main>
      <Tabchild />
    </Box>
  );
};
