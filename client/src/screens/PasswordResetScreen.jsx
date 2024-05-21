import {
  Container,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as ReactLink, useParams } from "react-router-dom";
import * as Yup from "yup";
import PasswordField from "../components/PasswordField";
import { resetPassword, resetState } from "../redux/actions/userActions";

const PasswordResetScreen = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();

  const { loading, error, serverStatus, serverMsg } = useSelector(
    (state) => state.user
  );

  const headingBreakpoint = useBreakpointValue({ base: "xs", md: "sm" });
  const boxBreakpoint = useBreakpointValue({
    base: "transparent",
    md: "bg-surface",
  });

  useEffect(() => {
    if (serverStatus && serverMsg) {
      toast({
        description: `${serverMsg}`,
        status: "success",
        isClosable: true,
      });
      dispatch(resetState());
    }
  }, [error, toast, serverMsg, serverStatus, dispatch]);

  const initialValues = {
    password: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(3, "Password is too short, must contain at least 3 characters")
      .required("New password required!"),
    confirmPassword: Yup.string("Invalid password!")
      .min(3, "Password is too short, must contain at least 3 characters")
      .required("Confirm new password is required!")
      .oneOf([Yup.ref("password"), null], "Passwords must match!"),
  });

  const onSubmit = (values) => {
    dispatch(resetPassword(values.password, token));
  };

  return serverStatus ? (
    <Center minHeight={"90vh"}>
      <VStack>
        <Text marginY={"10"} fontSize={"xl"}>
          Password reset successful!
        </Text>
        <Button
          to={"/login"}
          as={ReactLink}
          variant={"outline"}
          colorScheme="cyan"
          width={"300px"}
        >
          Login
        </Button>
        <Button
          to={"/products"}
          as={ReactLink}
          variant={"outline"}
          colorScheme="cyan"
          width={"300px"}
        >
          Products
        </Button>
      </VStack>
    </Center>
  ) : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Container
          maxWidth={"lg"}
          paddingY={{ base: "12", md: "24" }}
          paddingX={{ base: "0", md: "8" }}
          minHeight={"4xl"}
        >
          <Stack spacing={"8"}>
            <Stack spacing={"6"}>
              <Stack spacing={{ base: "2", md: "3" }} textAlign={"center"}>
                <Heading size={headingBreakpoint}>Reset your password.</Heading>
              </Stack>
            </Stack>
            <Box
              paddingY={{ base: "0", md: "8" }}
              paddingX={{ base: "4", md: "10" }}
              bg={{ boxBreakpoint }}
              boxShadow={{ base: "none", md: "xl" }}
            >
              <Stack spacing={"6"} as={"form"} onSubmit={formik.handleSubmit}>
                {error && (
                  <Alert
                    status="error"
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    textAlign={"center"}
                  >
                    <AlertIcon />
                    <AlertTitle>Sorry :(</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Stack spacing={"5"}>
                  <FormControl>
                    <PasswordField
                      type={"password"}
                      placeholder={"New password"}
                      name={"password"}
                      label={"New Password"}
                    />
                    <PasswordField
                      type={"password"}
                      placeholder={"Confirm your new password"}
                      name={"confirmPassword"}
                      label={"Confirm new password"}
                    />
                  </FormControl>
                </Stack>
                <Stack spacing={"6"}>
                  <Button
                    colorScheme="cyan"
                    size={"lg"}
                    fontSize={"md"}
                    isLoading={loading}
                    type="submit"
                  >
                    Set new password
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      )}
    </Formik>
  );
};

export default PasswordResetScreen;
