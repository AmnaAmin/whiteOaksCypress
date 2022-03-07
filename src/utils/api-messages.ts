import { UseToastOptions } from "@chakra-ui/toast";

export const successMessage = (
  title: string,
  description: string
): UseToastOptions => {
  return {
    title,
    description,
    status: "success",
    isClosable: true,
  };
};
