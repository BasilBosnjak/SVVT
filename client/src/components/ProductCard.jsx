import React, { useState } from "react";
import { BiExpand } from "react-icons/bi";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

import {
  Box,
  Skeleton,
  Image,
  Badge,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";

const ProductCard = ({ product, isLoading }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.product);
  const [isShown, setIsShown] = useState(false);
  return (
    <Skeleton isLoaded={!isLoading} _hover={{ size: 1.5 }}>
      <Box
        _hover={{ transform: "scale(1.1)", transitionDuration: "0.5s" }}
        overflow="hidden"
        borderWidth="1px"
        padding="4"
        shadow="md"
      >
        <Image
          src={
            isShown && product.images.length === 2
              ? product.images[1]
              : product.images[0]
          }
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
          fallbackSrc={"https://via.placeholder.com/150"}
          alt={product.name}
          height={180}
          marginInline={"auto"}
        />
        {product.stock < 5 ? (
          <Badge colorScheme="yellow">Only {product.stock} left</Badge>
        ) : product.stock < 1 ? (
          <Badge colorScheme="red">Out of stock</Badge>
        ) : (
          <Badge colorScheme="green">In stock</Badge>
        )}
        {product.productIsNew && (
          <Badge ml="2" colorScheme="pink">
            New
          </Badge>
        )}
        <Text noOfLines={1} fontSize={"x-large"} fontWeight={700} marginTop={2}>
          {`${product.brand} ${product.name}`}
        </Text>
        <Text noOfLines={1} fontSize={"medium"} color={"gray.600"}>
          {`${product.subtitle}`}
        </Text>
        <Flex alignItems={"center"} marginTop={2} justify={"space-between"}>
          <Badge colorScheme={"cyan"}>{product.category}</Badge>
          <Text fontWeight={700} fontSize={"x-large"} color={"cyan.600"}>
            {`€${product.price}`}
          </Text>
        </Flex>
        <Flex justify={"space-between"} marginTop={2}>
          {favorites.includes(product._id) ? (
            <IconButton
              icon={<MdOutlineFavorite size={20} />}
              colorScheme="cyan"
              size={"sm"}
              onClick={() => dispatch(removeFromFavorites(product._id))}
            />
          ) : (
            <IconButton
              icon={<MdOutlineFavoriteBorder size={20} />}
              colorScheme="cyan"
              size={"sm"}
              onClick={() => dispatch(addToFavorites(product._id))}
            />
          )}
          <IconButton
            icon={<BiExpand size={20} />}
            colorScheme={"cyan"}
            size="sm"
            as={ReactLink}
            to={`/product/${product._id}`}
          />
        </Flex>
      </Box>
    </Skeleton>
  );
};

export default ProductCard;
