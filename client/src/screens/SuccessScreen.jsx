import { Center, Text, Box, Button } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { BsBoxSeamFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetCart } from "../redux/actions/cartActions";

const SuccessScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetCart());
  }, [dispatch]);

  return (
    <Center height={"100vh"} flexDirection={"column"}>
      <Text fontSize={{ base: "md", md: "xl", lg: "4xl" }}>
        Payment process successful, thank you for your purchase.
      </Text>
      <Box margin={"2"}>
        <BsBoxSeamFill size={"50px"} marginTop={"2"} />
      </Box>

      <Text>Check your order in the order history.</Text>
      <Button as={ReactLink} to={"/order-history"} marginTop={"2"}>
        Go to order history
      </Button>
    </Center>
  );
};

export default SuccessScreen;
