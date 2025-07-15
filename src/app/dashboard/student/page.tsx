"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Grid,
  Heading,
  Text,
  Flex,
  useColorModeValue,
  ScaleFade,
  Icon,
} from "@chakra-ui/react";
import { FiBriefcase, FiFileText } from "react-icons/fi";

export default function StudentDashboard() {
  const { currentUser, loading, role } = useAuth();
  const router = useRouter();

  // Move all useColorModeValue hooks to the top level
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, blue.600)",
    "linear(to-r, blue.600, blue.800)"
  );
  const boxBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    if (!loading && (!currentUser || role !== "student")) {
      router.push("/login");
    }
  }, [currentUser, loading, role, router]);

  if (loading) {
    return <Text p={4}>Loading student dashboard...</Text>;
  }

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <ScaleFade initialScale={0.9} in={true}>
        <Box
          bgGradient={bgGradient}
          color="white"
          p={6}
          borderRadius="md"
          mb={8}
          shadow="md"
          textAlign="center"
        >
          <Heading size="lg" mb={2}>
            🎓 Welcome back, {currentUser?.displayName || "Student"}!
          </Heading>
          <Text fontSize="md" opacity={0.85}>
            Ready to find your next opportunity?
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <Link href="/dashboard/opportunities" passHref>
            <Box
              as="a"
              p={5}
              bg={boxBg}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
              cursor="pointer"
            >
              <Flex align="center" mb={4}>
                <Icon as={FiBriefcase} boxSize={6} color="blue.500" mr={3} />
                <Heading size="md">Browse Opportunities</Heading>
              </Flex>
              <Text color={textColor}>
                Internships, learnerships, & more.
              </Text>
            </Box>
          </Link>
          <Link href="/dashboard/applications" passHref>
            <Box
              as="a"
              p={5}
              bg={boxBg}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
              cursor="pointer"
            >
              <Flex align="center" mb={4}>
                <Icon as={FiFileText} boxSize={6} color="blue.500" mr={3} />
                <Heading size="md">Your Applications</Heading>
              </Flex>
              <Text color={textColor}>
                Check status, feedback, and progress.
              </Text>
            </Box>
          </Link>
        </Grid>
      </ScaleFade>
    </Box>
  );
}
