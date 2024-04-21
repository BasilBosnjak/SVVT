import React from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant={"ghost"}
    />
  );
};

export default ToggleColorMode;
