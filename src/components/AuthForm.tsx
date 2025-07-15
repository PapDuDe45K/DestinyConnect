"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (email: string, password: string, role?: "student" | "company") => void;
  error?: string;
}

export default function AuthForm({ type, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "company">("student");
  const [showPassword, setShowPassword] = useState(false);

  const isSignup = type === "signup";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      onSubmit(email, password, role);
    } else {
      onSubmit(email, password);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} maxW="md" mx="auto" p={4}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          <Button
            size="sm"
            mt={2}
            onClick={() => setShowPassword((show) => !show)}
            variant="link"
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </Button>
        </FormControl>

        {isSignup && (
          <Box>
            <Text mb={2} fontWeight="semibold">
              Select Role
            </Text>
            <HStack spacing={4}>
              <Button
                colorScheme={role === "student" ? "blue" : "gray"}
                variant={role === "student" ? "solid" : "outline"}
                onClick={() => setRole("student")}
                flex={1}
              >
                Student
              </Button>
              <Button
                colorScheme={role === "company" ? "purple" : "gray"}
                variant={role === "company" ? "solid" : "outline"}
                onClick={() => setRole("company")}
                flex={1}
              >
                Company
              </Button>
            </HStack>
          </Box>
        )}

        {error && (
          <Text color="red.500" fontSize="sm" mt={2} textAlign="center">
            {error}
          </Text>
        )}

        <Button
          type="submit"
          colorScheme={isSignup ? "blue" : "purple"}
          size="lg"
          mt={4}
          isDisabled={!email || !password}
        >
          {isSignup ? "Sign up" : "Log in"}
        </Button>
      </VStack>
    </Box>
  );
}
