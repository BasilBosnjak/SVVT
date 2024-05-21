import { Formik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/actions/userActions";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import { Link as ReactLink } from "react-router-dom";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const redirect = "/products";
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.user);
  const headingBreakpoint = useBreakpointValue({ base: "xs", md: "sm" });
  const boxBreakpoint = useBreakpointValue({
    base: "transparent",
    md: "bg-surface",
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required!"),
    email: Yup.string()
      .email("Invalid email!")
      .required("Email address is required!"),
    password: Yup.string()
      .min(3, "Password is too short, must be at least 3 characters!")
      .required(),
    confirmPassword: Yup.string()
      .min(3, "Confirm password is too short, must be at least 3 characters!")
      .required()
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const onSubmit = (values) => {
    dispatch(register(values.name, values.email, values.password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
      toast({
        description: userInfo.firstLogin
          ? "Account created. Welcome!"
          : `Welcome back ${userInfo.name}`,
        status: "success",
        isClosable: true,
      });
    }
  }, [userInfo, redirect, error, navigate, toast]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Container
          maxW="lg"
          py={{ base: "12", md: "24" }}
          px={{ base: "0", md: "8" }}
          minH="4xl"
        >
          <Stack spacing="8">
            <Stack spacing="6">
              <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                <Heading size={headingBreakpoint}>Create an account.</Heading>
                <HStack spacing="1" justify="center">
                  <Text color="muted">Already a user?</Text>
                  <Button
                    as={ReactLink}
                    to="/login"
                    variant="link"
                    colorScheme="cyan"
                  >
                    Sign in
                  </Button>
                </HStack>
              </Stack>
            </Stack>
            <Box
              py={{ base: "0", md: "8" }}
              px={{ base: "4", md: "10" }}
              bg={{ boxBreakpoint }}
              boxShadow={{ base: "none", md: "xl" }}
            >
              <Stack spacing="6" as="form" onSubmit={formik.handleSubmit}>
                {error && (
                  <Alert
                    status="error"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <AlertIcon />
                    <AlertTitle>We are sorry!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Stack spacing="5">
                  <FormControl>
                    <TextField
                      type="text"
                      name="name"
                      placeholder="Your first and last name."
                      label="Full name"
                    />
                    <TextField
                      type="text"
                      name="email"
                      placeholder="example@example.com"
                      label="Email"
                    />
                    <PasswordField
                      type="password"
                      name="password"
                      placeholder="Your password"
                      label="Password"
                    />
                    <PasswordField
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      label="Confirm password"
                    />
                  </FormControl>
                </Stack>
                <Stack spacing="6">
                  <Button
                    colorScheme="cyan"
                    size="lg"
                    fontSize="md"
                    isLoading={loading}
                    type="submit"
                  >
                    Sign up
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

export default RegisterScreen;
