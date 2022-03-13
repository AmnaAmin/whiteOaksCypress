import { Progress, ProgressProps } from "@chakra-ui/react";

export const BlankSlate: React.FC<ProgressProps> = (props) => {
  return (
    <Progress
      isIndeterminate
      size="lg"
      colorScheme="lightGray"
      aria-label="loading"
      rounded="2xl"
      my={2}
      {...props}
    />
  );
};
