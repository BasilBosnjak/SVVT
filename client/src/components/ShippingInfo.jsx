import {
  Box,
  Stack,
  Text,
  Button,
  Flex,
  FormControl,
  Heading,
  Radio,
  RadioGroup,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setShipping } from "../redux/actions/cartActions";
import { setAddress, setPayment } from "../redux/actions/orderActions";
import TextField from "./TextField";
import { Link as ReactLink } from "react-router-dom";

const ShippingInfo = () => {
  const { shipping } = useSelector((state) => state.cart);
  const { shippingAddress } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  const initialValues = {
    address: shippingAddress ? shippingAddress.address : "",
    postalCode: shippingAddress ? shippingAddress.postalCode : "",
    city: shippingAddress ? shippingAddress.city : "",
    country: shippingAddress ? shippingAddress.country : "",
  };

  const validationSchema = Yup.object({
    address: Yup.string()
      .required("Address is required.")
      .min(5, "Address is too short."),
    postalCode: Yup.string()
      .required("Postal code is required.")
      .min(5, "Postal code is too short."),
    city: Yup.string()
      .required("City is required.")
      .min(5, "City is too short."),
    country: Yup.string()
      .required("Country is required.")
      .min(5, "Country is too short."),
  });

  const onSubmit = async (values) => {
    dispatch(setAddress(values));
    dispatch(setPayment());
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <>
          <VStack as={"form"}>
            <FormControl>
              <TextField
                name={"address"}
                type={"text"}
                placeholder={"Enter street address..."}
                label={"Street address"}
              />
              <Flex>
                <Box flex={"1"} marginRight={"10"}>
                  <TextField
                    name={"postalCode"}
                    type={"number"}
                    placeholder={"Enter postal code..."}
                    label={"Postal code"}
                  />
                </Box>
                <Box flex={"2"}>
                  <TextField
                    name={"city"}
                    type={"text"}
                    placeholder={"Enter city..."}
                    label={"City"}
                  />
                </Box>
              </Flex>
              <TextField
                name={"country"}
                type={"text"}
                placeholder={"Enter country..."}
                label={"Country"}
              />
            </FormControl>
            <Box width={"100%"} paddingRight={"5"} fontSize={"2xl"}>
              <Heading fontWeight={"extrabold"} marginBottom={"10"}>
                Shipping:
              </Heading>
              <RadioGroup
                defaultValue={shipping === 9.99 ? "withoutExpress" : "express"}
                onChange={(e) =>
                  dispatch(
                    setShipping(
                      e === "express"
                        ? Number(19.99).toFixed(2)
                        : Number(9.99).toFixed(2)
                    )
                  )
                }
              >
                <Stack
                  direction={{ base: "column", lg: "row" }}
                  align={{ lg: "flex-start" }}
                >
                  <Stack
                    paddingRight={"10"}
                    spacing={{ base: "8", md: "10" }}
                    flex={"1.5"}
                  >
                    <Radio value="express">
                      <Box>
                        <Text fontWeight={"bold"}>Express 19.99</Text>
                        <Text>At your address within 48 hours!</Text>
                      </Box>
                    </Radio>
                    <Stack spacing="6"></Stack>
                  </Stack>
                  <Radio value="withoutExpress">
                    <Box>
                      <Text fontWeight={"bold"}>Standard 9.99</Text>
                      <Text>At your address within 2 - 5 business days!</Text>
                    </Box>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </VStack>
          <Flex
            alignItems={"center"}
            gap={"2"}
            direction={{ base: "column", lg: "row" }}
          >
            <Button
              as={ReactLink}
              to={`/cart`}
              width={"100%"}
              variant={"outline"}
              colorScheme="cyan"
            >
              Back to cart
            </Button>
            <Button
              as={ReactLink}
              to={`/payment`}
              width={"100%"}
              variant={"outline"}
              colorScheme="cyan"
              onClick={formik.handleSubmit}
            >
              Continue to payment
            </Button>
          </Flex>
        </>
      )}
    </Formik>
  );
};

export default ShippingInfo;
