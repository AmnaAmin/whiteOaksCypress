import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export const Alerts = () => {
  return (
    <>
      <Box bg="teal.100" w="100%" h="400px" p="100px">
        <VStack>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Warning!!!</AlertTitle>
            <AlertDescription>Please Change it now</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
          <br />
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Please Check your page</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
          <br />
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Well done</AlertTitle>
            <AlertDescription>You are successful</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
          <br />
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Warning!!!</AlertTitle>
            <AlertDescription>something went wrong</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        </VStack>
      </Box>
    </>
  );
};
