import { Flex, HStack } from "@chakra-ui/layout";
import { Card } from "./card";

const storyInfo = { title: "Card" };
export default storyInfo;

export const CardDefault = () => {
  return <Card height="150px">Card description</Card>;
};

export const MultipleCards = () => {
  return (
    <HStack>
      <Card height="150px">Card description</Card>
      <Card height="150px">Card description</Card>
      <Card height="150px">Card description</Card>
      <Card height="150px">Card description</Card>
      <Card height="150px">Card description</Card>
    </HStack>
  );
};

export const BigCard = () => <Card height="500px" width="500px"></Card>;
