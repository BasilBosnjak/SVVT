import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Wrap,
  Spinner,
  useColorModeValue as colorMode,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

const CartScreen = () => {
  const { loading, error, cartItems } = useSelector((state) => state.cart);

  const getHeadingContent = () => {
    return cartItems.length === 1 ? `(1 Item)` : `(${cartItems.length} Items)`;
  };

  return (
    <Wrap spacing={"30px"} justify={"center"} minHeight={"100vh"}>
      {loading ? (
        <Stack spacing={4} direction={"row"}>
          <Spinner
            marginTop={"20"}
            thickness="2px"
            speed="0.55s"
            emptyColor="gray.300"
            color="cyan.500"
            size={"xl"}
          />
        </Stack>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Sorry :(</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : cartItems.length <= 0 ? (
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Your cart is empty!</AlertTitle>
          <AlertDescription>
            <Link as={ReactLink} to={"/products"}>
              Click here to go back to the products screen.
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <Box
          paddingX={"4"}
          paddingY={"8"}
          width={{ base: "95%", md: "70%", lg: "50%" }}
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            align={{ lg: "flex-start" }}
            spacing={{ base: "8", md: "16" }}
          >
            <Stack spacing={{ base: "8", md: "10" }} flex={"2"}>
              <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
                Shopping Cart
              </Heading>

              <Stack spacing={"6"}>
                {cartItems.map((cartItem) => (
                  <CartItem cartItem={cartItem} key={cartItem.id} />
                ))}
              </Stack>
            </Stack>
            <Flex flex={"1"} align={"center"} direction={"column"}>
              <OrderSummary />

              <HStack marginTop={"6"} fontWeight={"semibold"}>
                <p>or</p>
                <Link
                  as={ReactLink}
                  to={"/products"}
                  color={colorMode("cyan.500", "orange.300")}
                >
                  Continue Shopping
                </Link>
              </HStack>
            </Flex>
          </Stack>
        </Box>
      )}
    </Wrap>
  );
};

export default CartScreen;
