import {
  Box,
  Heading,
  Flex,
  Stack,
  Image,
  Link,
  Icon,
  Skeleton,
  useColorMode,
  useColorModeValue as colorMode,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { BsWindowDesktop, BsLaptop } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

const LandingScreen = () => {
  return (
    <Box
      maxWidth={"8xl"}
      mx={"auto"}
      padding={{ base: "0", lg: "12" }}
      minHeight={"6xl"}
    >
      <Stack
        direction={{ base: "column-reverse", lg: "row" }}
        spacing={{ base: "0", lg: "20" }}
      >
        <Box
          width={{ lg: "sm" }}
          transform={{ base: "translateY(-50%)", lg: "none" }}
          background={{
            base: colorMode("cyan.50", "gray.700"),
            lg: "transparent",
          }}
          marginX={{ base: "6", md: "8", lg: "0" }}
          paddingX={{ base: "6", md: "8", lg: "0" }}
          paddingY={{ base: "6", md: "8", lg: "12" }}
        >
          <Stack spacing={{ base: "8", lg: "10" }}>
            <Stack spacing={{ base: "2", lg: "4" }}>
              <Flex alignItems={"center"}>
                <Icon
                  as={BsLaptop}
                  height={12}
                  width={12}
                  color={colorMode("blue.600", "orange.500")}
                />
                <Text fontSize={"4xl"} fontWeight={"bold"} marginLeft={"5px"}>
                  Shopium
                </Text>
              </Flex>
              <Heading size={"xl"} fontWeight={"semibold"}>
                Fulfill your tech needs
              </Heading>
            </Stack>
            <HStack display={"flex"}>
              <Link
                as={ReactLink}
                to={"/products"}
                color={colorMode("blue.600", "orange.500")}
              >
                Explore now
              </Link>
              <Icon
                color={colorMode("blue.600", "orange.500")}
                as={FaArrowRight}
              />
            </HStack>
          </Stack>
        </Box>
        <Flex flex={1} overflow={"hidden"}>
          <Image
            src={colorMode(
              "images/landing-light.jpg",
              "images/landing-dark.jpg"
            )}
            flex={1}
            objectFit={"cover"}
            minHeight={550}
            minWidth={300}
            fallback={<Skeleton />}
          />
        </Flex>
      </Stack>
    </Box>
  );
};

export default LandingScreen;
