import { ChakraProvider } from "@chakra-ui/react";
import ProductsScreen from "./screens/ProductsScreen";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import ProductScreen from "./screens/ProductScreen";
import LandingScreen from "./screens/LandingScreen";
import CartScreen from "./screens/CartScreen";
import Footer from "./components/Footer";
import LoginScreen from "./screens/LoginScreen";
import EmailVerificationScreen from "./screens/EmailVerificationScreen";
import PasswordResetScreen from "./screens/PasswordResetScreen";
import RegisterScreen from "./screens/RegisterScreen";
import axios from "axios";
import { VStack, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [googleClient, setGoogleClient] = useState(null);
  useEffect(() => {
    const googleKey = async () => {
      const { data: googleId } = await axios.get(`/api/config/google`);
      setGoogleClient(googleId);
    };
    googleKey();
  }, [googleClient]);

  return !googleClient ? (
    <VStack paddingTop={"38vh"}>
      <Spinner
        marginTop={"20"}
        thickness="2px"
        speed="0.55s"
        emptyColor="gray.300"
        color="cyan.500"
        size={"xl"}
      />
    </VStack>
  ) : (
    <GoogleOAuthProvider clientId={googleClient}>
      <ChakraProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path={"/"} element={<LandingScreen />} />
              <Route path={"/products"} element={<ProductsScreen />} />
              <Route path={"/product/:id"} element={<ProductScreen />} />
              <Route path={"/cart"} element={<CartScreen />} />
              <Route path={"/login"} element={<LoginScreen />} />
              <Route path={"/register"} element={<RegisterScreen />} />
              <Route
                path={"/email-verify/:token"}
                element={<EmailVerificationScreen />}
              />
              <Route
                path={"/password-reset/:token"}
                element={<PasswordResetScreen />}
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
