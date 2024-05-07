import React from "react";
import {
  Text,
  Flex,
  VStack,
  Image,
  Select,
  Spacer,
  useColorModeValue as colorMode,
  CloseButton,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addCartItem, removeCartItem } from "../redux/actions/cartActions";

const CartItem = ({ cartItem }) => {
  const { name, image, price, stock, qty, id, brand } = cartItem;
  const dispatch = useDispatch();

  return (
    <Flex
      minWidth={"300px"}
      borderWidth={"1px"}
      rounded={"lg"}
      align={"center"}
    >
      <Image
        rounded={"lg"}
        src={image}
        width={"120px"}
        height={"120px"}
        fit={"cover"}
        fallbackSrc="https://via.placeholder.com/150"
      />
      <VStack padding={"2"} width={"100%"} spacing={"4"} align={"stretch"}>
        <Flex alignItems={"center"} justify={"space-between"}>
          <Text fontWeight={"medium"}>
            {brand} {name}
          </Text>
          <Spacer />
          <CloseButton onClick={() => dispatch(removeCartItem(id))} />
        </Flex>
        <Spacer />
        <Flex alignItems={"center"} justify={"space-between"}>
          <Select
            onChange={(e) => dispatch(addCartItem(id, e.target.value))}
            maxWidth={"65px"}
            value={qty}
            focusBorderColor={colorMode("cyan.500", "orange.300")}
          >
            {[...Array(stock).keys()].map((item) => (
              <option key={item + 1} value={item + 1}>
                {item + 1}
              </option>
            ))}
          </Select>
          <Text fontWeight={"bold"}>€{price}</Text>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default CartItem;
