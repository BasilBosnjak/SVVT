import React from "react";
import {
  Button,
  Flex,
  Stack,
  Text,
  Heading,
  useColorModeValue as colorMode,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const OrderSummary = () => {
  const { subtotal, shipping } = useSelector((state) => state.cart);
  return (
    <Stack
      minWidth={"300px"}
      spacing={"8"}
      borderWidth={"1px"}
      borderColor={colorMode("cyan.500", "orange.300")}
      rounded={"lg"}
      padding={"8"}
      width={"full"}
    >
      <Heading size={"md"}>Order Summary</Heading>
      <Stack spacing={"6"}>
        <Flex justify={"space-between"}>
          <Text
            fontWeight={"medium"}
            color={colorMode("cyan.500", "orange.300")}
          >
            Subtotal
          </Text>
          <Text fontWeight={"medium"}>€{subtotal}</Text>
        </Flex>
        <Flex justify={"space-between"}>
          <Text
            fontWeight={"medium"}
            color={colorMode("cyan.500", "orange.300")}
          >
            Shipping
          </Text>
          <Text fontWeight={"medium"}>€{shipping}</Text>
        </Flex>
        <Flex justify={"space-between"}>
          <Text fontWeight={"extrabold"} fontSize={"xl"}>
            Total
          </Text>
          <Text fontWeight={"medium"}>
            €{Number(subtotal) + Number(shipping)}
          </Text>
        </Flex>
      </Stack>
      <Button
        as={ReactLink}
        to={"/checkout"}
        size={"lg"}
        colorScheme="cyan"
        rightIcon={<FaArrowRight />}
      >
        Checkout
      </Button>
    </Stack>
  );
};

export default OrderSummary;
