import React from "react";
import { Button, ButtonGroup, HStack, VStack } from "@chakra-ui/react";
import {
  FcBrokenLink,
  FcClearFilters,
  FcCloth,
  FcCustomerSupport,
  FcDam,
  FcElectricity,
} from "react-icons/fc";
export const ButtonType = () => {
  return (
    <>
      <VStack border="3px dotted pink" w="100%" h="100%" bg="blue.100">
        <Button
          variant="ghost"
          size="xs"
          colorScheme="green"
          leftIcon={<FcCloth />}
        >
          Click me
        </Button>
        <br />
        <Button
          variant="link"
          size="sm"
          colorScheme="red"
          rightIcon={<FcCustomerSupport />}
        >
          Click me
        </Button>
        <br />
        <Button
          variant="outline"
          size="md"
          colorScheme="linkedin"
          leftIcon={<FcBrokenLink />}
        >
          Click me
        </Button>
        <br />
        <Button
          variant="solid"
          size="lg"
          colorScheme="purple"
          rightIcon={<FcDam />}
        >
          Click me
        </Button>
        <br />
        <Button
          variant="unstyled"
          size="lg"
          colorScheme="teal"
          rightIcon={<FcElectricity />}
        >
          Click me
        </Button>
        <Button
          isLoading
          loadingText="Now Check me"
          colorScheme="orange"
          size="lg"
          variant="outline"
          rightIcon={<FcClearFilters />}
        >
          Now Check me
        </Button>
        <ButtonGroup variant="ghost">
          <VStack>
            <Button colorScheme="orange">First</Button>

            <Button colorScheme="teal">Second</Button>

            <Button colorScheme="pink">Third</Button>
          </VStack>
        </ButtonGroup>
      </VStack>
    </>
  );
};
