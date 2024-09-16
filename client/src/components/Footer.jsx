import React from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  Stack,
  Container,
  Button,
  Input,
  useColorModeValue as colorMode,
  Divider,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { BsLaptop } from "react-icons/bs";

const Footer = () => {
  return (
    <Box width="100%" bg={colorMode("blue.600", "gray.900")}>
      <Container as="footer" maxWidth="7xl">
        <Stack
          spacing="8"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          paddingY={{ base: "12", md: "16" }}
        >
          <Stack spacing={{ base: "6", md: "8" }} align="start">
            <Flex alignItems="center">
              <Icon
                as={BsLaptop}
                height="10"
                width="10"
                color={colorMode("teal.100", "orange.500")}
              />
              <Text
                color={"teal.100"}
                fontSize="2xl"
                fontWeight="extrabold"
                marginLeft={"5px"}
              >
                Shopium
              </Text>
            </Flex>
            <Text color="muted">E-commerce simplified!</Text>
          </Stack>
          <Stack
            direction={{ base: "column-reverse", md: "column", lg: "row" }}
            spacing={{ base: "12", md: "8" }}
          >
            <Stack direction={"row"} spacing={"8"}>
              <Stack spacing={"4"} minWidth={"36"} flex={"1"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  color={"teal.100"}
                >
                  Product
                </Text>
                <Stack spacing={"3"} shouldWrapChildren>
                  <Button variant={"link"} color={"teal.300"}>
                    Pricing
                  </Button>
                  <Button variant={"link"} color={"teal.300"}>
                    How it works
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={"4"} minWidth={"36"} flex={"1"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  color={"teal.100"}
                >
                  Legal
                </Text>
                <Stack spacing={"3"} shouldWrapChildren>
                  <Button variant={"link"} color={"teal.300"}>
                    Terms & Conditions
                  </Button>
                  <Button variant={"link"} color={"teal.300"}>
                    Privacy Policy
                  </Button>
                  <Button variant={"link"} color={"teal.300"}>
                    License
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={"4"}>
              <Text fontSize={"sm"} fontWeight={"semibold"} color={"teal.100"}>
                Stay up to date with the latest news!
              </Text>
              <Stack
                spacing={"4"}
                direction={{ base: "column", sm: "row" }}
                maxWidth={{ lg: "360px" }}
              >
                <Input
                  borderColor={"black"}
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button
                  variant={"primary"}
                  type="submit"
                  color={"teal.100"}
                  flexShrink={"0"}
                  htmlFor
                >
                  Subscribe
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Divider borderColor={colorMode("teal.100", "orange.500")} />
        <Stack
          paddingTop={"8"}
          paddingBottom={"12"}
          justify={"space-between"}
          direction={{ base: "column-reverse", md: "row" }}
          align={"center"}
        >
          <Text fontSize={"sm"} color={"subtle"}>
            &copy; {new Date().getFullYear()} Shopium, LLC. All rights reserved.
          </Text>
          <ButtonGroup variant={"ghost"}>
            <IconButton
              as={"a"}
              href="#"
              color={colorMode("teal.100", "orange.500")}
              icon={<FaGithub fontSize={"1.5rem"} />}
            />
            <IconButton
              as={"a"}
              href="#"
              color={colorMode("teal.100", "orange.500")}
              icon={<FaLinkedinIn fontSize={"1.5rem"} />}
            />
            <IconButton
              as={"a"}
              href="#"
              color={colorMode("teal.100", "orange.500")}
              icon={<FaInstagram fontSize={"1.5rem"} />}
            />
          </ButtonGroup>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
