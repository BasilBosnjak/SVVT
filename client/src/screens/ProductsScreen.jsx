import { Box, Wrap, WrapItem, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../redux/actions/productActions";

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, products, pagination } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      {products.length > 1 && (
        <Box>
          <Wrap
            spacing={"30px"}
            justify={"center"}
            minHeight={"80vh"}
            mx={{ base: 12, md: 20, lg: 32 }}
          >
            {products.map((product) => (
              <WrapItem key={product._id}>
                <Center width={250} height={450}>
                  <ProductCard product={product} isLoading={loading} />
                </Center>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
    </>
  );
};

export default ProductsScreen;
