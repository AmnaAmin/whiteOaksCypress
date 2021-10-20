import { Flex } from "@chakra-ui/layout";
import { Header } from "./header";
import { Main } from "./main";
import { Sidebar } from "./sidebar";
export default { title: "Layout" };

export const LayoutStory = () => {
  return (
    <>
      <Header>Page Header</Header>
      <Sidebar>Page Side bar</Sidebar>
      <Main>
        <Flex height="200vh" w="100%" bg="darkblue">
          Contents
        </Flex>
      </Main>
    </>
  );
};
