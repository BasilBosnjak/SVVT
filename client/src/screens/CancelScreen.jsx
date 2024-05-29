import { Center, Text, Box, Button } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { BsBoxSeamFill } from "react-icons/bs";

const CancelScreen = () => {
  return (
    <Center height={"100vh"} flexDirection={"column"}>
      <Text fontSize={{ base: "md", md: "xl", lg: "4xl" }}>
        Payment process canceled.
      </Text>
      <Box margin={"2"}>
        <BsBoxSeamFill size={"50px"} marginTop={"2"} />
      </Box>

      <Text>Your cart is saved.</Text>
      <Button as={ReactLink} to={"/cart"} marginTop={"2"}>
        Go to cart
      </Button>
    </Center>
  );
};

export default CancelScreen;
