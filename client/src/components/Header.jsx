import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  Box,
  Text,
  Flex,
  HStack,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { toggleFavorites } from "../redux/actions/productActions";
import { useEffect } from "react";
import { Link as ReactLink } from "react-router-dom";
import NavLink from "./NavLink";
import ToggleColorMode from "./ToggleColorMode";
import { BsLaptop } from "react-icons/bs";
import { BiUserCheck } from "react-icons/bi";
import { useColorModeValue as colorMode } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const Links = [
  { name: "Products", route: "/products" },
  { name: "Contact", route: "/contact" },
  { name: "New Deals", route: "/new-deals" },
];

export const Header = () => {
  const dispatch = useDispatch();
  const { favoritesToggled } = useSelector((state) => state.product);
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {}, [favoritesToggled, dispatch]);

  return (
    <Box bg={colorMode("cyan.300", "gray.900")} paddingX={"4"}>
      <Flex height={"16"} alignItems={"center"} justify={"space-between"}>
        <Flex display={{ base: "flex", md: "none" }} alignItems={"center"}>
          <IconButton
            bg={"parent"}
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            onClick={isOpen ? onClose : onOpen}
          />
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
            <ToggleColorMode />
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
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <BiUserCheck />
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
  );
};
