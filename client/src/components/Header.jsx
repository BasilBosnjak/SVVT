import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  Box,
  Text,
  Flex,
  HStack,
  Icon,
  Stack,
  AlertDescription,
  Alert,
  AlertIcon,
  AlertTitle,
  Divider,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { toggleFavorites } from "../redux/actions/productActions";
import { useEffect, useState } from "react";
import { Link as ReactLink, useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import ToggleColorMode from "./ToggleColorMode";
import { BsLaptop } from "react-icons/bs";
import { BiUserCheck, BiLogInCircle } from "react-icons/bi";
import { TbShoppingCart } from "react-icons/tb";
import { useColorModeValue as colorMode } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { logout } from "../redux/actions/userActions";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Links = [
  { name: "Products", route: "/products" },
  { name: "Contact", route: "/contact" },
  { name: "New Deals", route: "/new-deals" },
];

export const Header = () => {
  const dispatch = useDispatch();
  const { favoritesToggled } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const location = useLocation();
  const toast = useToast();
  const { userInfo } = useSelector((state) => state.user);
  const [showBanner, setShowBanner] = useState(
    userInfo ? !userInfo.active : false
  );

  useEffect(() => {
    if (userInfo && !userInfo.active) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [userInfo, favoritesToggled, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      description: "Logged out successfully!",
      status: "success",
      isClosable: true,
    });
  };

  return (
    <>
      <Box bg={colorMode("cyan.300", "gray.900")} paddingX={"4"}>
        <Flex height={"16"} alignItems={"center"} justify={"space-between"}>
          <Flex display={{ base: "flex", md: "none" }} alignItems={"center"}>
            <IconButton
              bg={"parent"}
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              onClick={isOpen ? onClose : onOpen}
            />
            <IconButton
              marginLeft={"12"}
              position={"absolute"}
              as={ReactLink}
              icon={<TbShoppingCart size="20px" />}
              to={"/cart"}
              variant={"ghost"}
            />
            {cartItems.length > 0 && (
              <Text
                fontWeight={"bold"}
                fontStyle={"italic"}
                position={"absolute"}
                marginLeft={"75px"}
                marginTop={"-6"}
                fontSize={"small"}
              >
                {cartItems.length}
              </Text>
            )}
          </Flex>
          <HStack spacing={"8"} alignItems={"center"}>
            <Box alignItems={"center"} display={"flex"} as={ReactLink} to={"/"}>
              <Icon
                as={BsLaptop}
                color={colorMode("black", "orange.300")}
                height={"6"}
                width={"6"}
              />
              <Text fontWeight={"bold"} marginX={"8px"}>
                Shopium
              </Text>
            </Box>
            <HStack
              as={"nav"}
              display={{ base: "none", md: "flex" }}
              spacing={"4"}
            >
              {Links.map((link) => (
                <NavLink route={link.route} key={link.route}>
                  <Text fontWeight={"medium"} paddingX={"8px"}>
                    {link.name}
                  </Text>
                </NavLink>
              ))}

              <Box>
                <IconButton
                  as={ReactLink}
                  icon={<TbShoppingCart size="20px" />}
                  to={"/cart"}
                  variant={"ghost"}
                />
                {cartItems.length > 0 && (
                  <Text
                    fontWeight={"bold"}
                    fontStyle={"italic"}
                    position={"absolute"}
                    marginLeft={"25px"}
                    marginTop={"-6"}
                    fontSize={"small"}
                  >
                    {cartItems.length}
                  </Text>
                )}
              </Box>

              <ToggleColorMode />
              {location.pathname !== "/" &&
                (favoritesToggled ? (
                  <IconButton
                    icon={<MdOutlineFavorite size={20} />}
                    onClick={() => dispatch(toggleFavorites(false))}
                    variant={"ghost"}
                  />
                ) : (
                  <IconButton
                    icon={<MdOutlineFavoriteBorder size={20} />}
                    onClick={() => dispatch(toggleFavorites(true))}
                    variant={"ghost"}
                  />
                ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {userInfo ? (
              <Menu>
                <MenuButton
                  rounded={"full"}
                  variant="link"
                  cursor={"pointer"}
                  minWidth={"0"}
                >
                  <HStack>
                    <BiUserCheck size={"30"} />
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <HStack>
                    <Text paddingLeft={"3"} as={"i"}>
                      {userInfo.email}
                    </Text>
                  </HStack>
                  <Divider paddingY={"1"} />
                  <MenuItem as={ReactLink} to={"/order-history"}>
                    Order History
                  </MenuItem>
                  <MenuItem as={ReactLink} to={"/profile"}>
                    Profile
                  </MenuItem>
                  {userInfo.isAdmin && (
                    <>
                      <MenuDivider />
                      <MenuItem as={ReactLink} to={"/admin-panel"}>
                        Admin Panel
                      </MenuItem>
                    </>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Menu>
                <MenuButton
                  as={IconButton}
                  variant={"ghost"}
                  cursor={"pointer"}
                  icon={<BiLogInCircle size={"25px"} />}
                />
                <MenuList>
                  <MenuItem
                    as={ReactLink}
                    to={"/login"}
                    padding={"2"}
                    fontWeight={"400"}
                    variant="link"
                  >
                    Sign In
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    as={ReactLink}
                    to={"/register"}
                    padding={"2"}
                    fontWeight={"400"}
                    variant="link"
                  >
                    Sign Un
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
        <Box display={"flex"}>
          {isOpen && (
            <Box paddingBottom={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink route={link.route} key={link.route}>
                    <Text fontWeight={"medium"} paddingX={"8px"}>
                      {link.name}
                    </Text>
                  </NavLink>
                ))}
              </Stack>
              {favoritesToggled ? (
                <IconButton
                  icon={<MdOutlineFavorite size={20} />}
                  onClick={() => dispatch(toggleFavorites(false))}
                  variant={"ghost"}
                />
              ) : (
                <IconButton
                  icon={<MdOutlineFavoriteBorder size={20} />}
                  onClick={() => dispatch(toggleFavorites(true))}
                  variant={"ghost"}
                />
              )}
              <ToggleColorMode />
            </Box>
          )}
        </Box>
      </Box>
      {userInfo && !userInfo.active && showBanner && (
        <Box>
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Email not yet verified!</AlertTitle>
            <AlertDescription>Verify your email address.</AlertDescription>
            <Spacer />
            <CloseIcon
              cursor={"pointer"}
              onClick={() => setShowBanner(false)}
            />
          </Alert>
        </Box>
      )}
    </>
  );
};
