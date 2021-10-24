import { Box } from "@chakra-ui/layout";
import { background } from "@chakra-ui/styled-system";
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
    ></Box>
  );
};
