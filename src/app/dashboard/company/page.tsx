"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Box,
  Grid,
  Heading,
  Text,
  Flex,
  Progress,
  Icon,
  useColorModeValue,
  ScaleFade,
} from "@chakra-ui/react";
import {
  FiBriefcase,
  FiUsers,
  FiSettings,
  FiArrowRight,
} from "react-icons/fi";

export default function CompanyDashboard() {
  const { currentUser, role, loading } = useAuth();

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, blue.600)",
    "linear(to-r, blue.600, blue.800)"
  );

  if (loading) return <Text p={4}>Loading...</Text>;

  if (!currentUser || role !== "company") {
    return <Text p={4}>Access denied. Please login as a company user.</Text>;
  }

  const companyName = currentUser.email?.split("@")[0] ?? "Company";

  const cards = [
    {
      icon: FiUsers,
      title: "Talent Pool",
      value: "24",
      description: "Qualified candidates",
      href: "/dashboard/company/applications",
      colorScheme: "blue",
      progress: null,
    },
    {
      icon: FiBriefcase,
      title: "Your Opportunities",
      value: "8",
      description: "Active listings",
      href: "/dashboard/company/post-opportunity",
      colorScheme: "green",
      progress: null,
    },
    {
      icon: FiSettings,
      title: "Company Profile",
      value: "65%",
      description: "Complete your profile",
      href: "/dashboard/company/complete-profile",
      colorScheme: "purple",
      progress: 65,
    },
  ];

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <ScaleFade initialScale={0.9} in={true}>
        <Box
          bgGradient={bgGradient}
          borderRadius="lg"
          p={6}
          mb={8}
          color="white"
          shadow="md"
          textAlign="center"
        >
          <Heading size="lg" mb={2}>
            Welcome back, {companyName}!
          </Heading>
          <Text fontSize="md" opacity={0.85}>
            Manage your opportunities and connect with talented students.
          </Text>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
        >
          {cards.map(({ icon, title, value, description, href, colorScheme, progress }) => (
            <Card
              key={title}
              icon={icon}
              title={title}
              value={value}
              description={description}
              href={href}
              colorScheme={colorScheme}
              progress={progress}
            />
          ))}
        </Grid>
      </ScaleFade>
    </Box>
  );
}

interface CardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  href: string;
  colorScheme: string;
  progress: number | null;
}

function Card({ icon, title, value, description, href, colorScheme, progress }: CardProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Box
        as="a"
        p={5}
        bg={useColorModeValue("white", "gray.700")}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
        cursor="pointer"
      >
        <Flex align="center" mb={4}>
          <Box
            as={icon}
            boxSize={8}
            color={`${colorScheme}.500`}
            mr={3}
          />
          <Heading size="md">{title}</Heading>
        </Flex>

        <Text fontSize="3xl" fontWeight="bold" mb={2}>
          {value}
        </Text>
        <Text color={useColorModeValue("gray.600", "gray.300")} mb={4}>
          {description}
        </Text>

        {progress !== null && (
          <>
            <Progress
              value={progress}
              size="sm"
              colorScheme={colorScheme}
              borderRadius="full"
              mb={2}
            />
            <Text fontSize="sm" color="gray.500">
              {progress}% complete
            </Text>
          </>
        )}

        <Flex mt={4} justify="flex-end" align="center" color={`${colorScheme}.500`} fontWeight="medium" fontSize="sm">
          <Text mr={1}>View details</Text>
          <Icon as={FiArrowRight} />
        </Flex>
      </Box>
    </Link>
  );
}
