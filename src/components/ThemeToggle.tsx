"use client";

import { useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  const iconColor = useColorModeValue("yellow.400", "orange.300");

  return (
    <IconButton
      aria-label="Toggle theme"
      icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      color={iconColor}
    />
  );
}
