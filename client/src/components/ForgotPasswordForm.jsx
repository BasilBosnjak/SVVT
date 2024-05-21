import { Text, Stack, Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendPasswordResetEmail } from "../redux/actions/userActions";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <Box marginY={"4"}>
        <Text as={"b"}>Please enter your email address below.</Text>
        <Text>
          You will receive an email with a link to reset your password.
        </Text>
      </Box>
      <Stack>
        <Input
          type="text"
          name="email"
          marginBottom={"4"}
          placeholder="example@example.com"
          value={email}
          label={"Email"}
          onChange={(e) => handleChange(e)}
        />
        <Button
          colorScheme="orange"
          size={"lg"}
          fontSize={"md"}
          onClick={() => dispatch(sendPasswordResetEmail(email))}
        >
          Send Email
        </Button>
      </Stack>
    </>
  );
};

export default ForgotPasswordForm;
