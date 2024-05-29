import { Box, Heading, Flex, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";
import ShippingInfo from "../components/ShippingInfo";

const CheckoutScreen = () => {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  return userInfo ? (
    <Box
      minHeight={"100vh"}
      maxWidth={{ base: "3xl", lg: "7xl" }}
      marginX={"auto"}
      paddingX={{ base: "4", md: "8", lg: "12" }}
      paddingY={{ base: "6", md: "8", lg: "12" }}
    >
      <Stack
        spacing={"8"}
        direction={{ base: "column", lg: "row" }}
        align={{ base: "revert", lg: "flex-start" }}
      >
        <Stack
          spacing={{ base: "8", md: "10" }}
          flex={"1.5"}
          marginBottom={{ base: "12", md: "none" }}
        >
          <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
            Shipping Info
          </Heading>
          <Stack>
            <ShippingInfo />
          </Stack>
        </Stack>
        <Flex direction={"column"} align={"center"} flex={"1"}>
          <OrderSummary checkoutScreen={true} />
        </Flex>
      </Stack>
    </Box>
  ) : (
    <Navigate to={"/login"} replace={true} state={{ from: location }} />
  );
};

export default CheckoutScreen;
