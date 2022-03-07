import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { useAuth } from "utils/auth-context";
import { Card } from "../features/login-form-centered/Card";
import { LoginForm } from "../features/login-form-centered/LoginForm";
import { Logo } from "../features/login-form-centered/Logo";

export const Login = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "inherit")}
      minH="100vh"
      py="12"
      px={{ base: "4", lg: "8" }}
      display="flex"
      dir="column"
      alignItems="center"
    >
      <Box width="100%" maxW="md" mx="auto">
        {/* <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} /> */}
        <Heading textAlign="center" size="xl" fontWeight="extrabold" mb="10">
          Sign in
        </Heading>
        <Card>
          <LoginForm />
        </Card>
      </Box>
    </Box>
  );
};
