import {
  Box,
  Wrap,
  WrapItem,
  Center,
  Button,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../redux/actions/productActions";

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, products, pagination, favoritesToggled } =
    useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts(1));
  }, [dispatch]);

  const paginationButtonHandler = (page) => {
    dispatch(getProducts(page));
  };

  return (
    <>
      {products.length >= 1 && (
        <Box>
          <Wrap
            spacing={"30px"}
            justify={"center"}
            minHeight={"80vh"}
            mx={{ base: 12, md: 20, lg: 32 }}
          >
            {error ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Sorry :( </AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              products.map((product) => (
                <WrapItem key={product._id}>
                  <Center width={250} height={450}>
                    <ProductCard product={product} isLoading={loading} />
                  </Center>
                </WrapItem>
              ))
            )}
          </Wrap>
          {!favoritesToggled && (
            <Wrap justify={"center"} justifyContent={"center"} padding={4}>
              <Button
                colorScheme="blue"
                onClick={() => paginationButtonHandler(1)}
                isDisabled={pagination.currentPage === 1}
              >
                <MdArrowLeft size={30} />
              </Button>
              {Array.from(Array(pagination.totalPages), (e, i) => {
                return (
                  <Button
                    colorScheme={
                      pagination.currentPage === i + 1 ? "blue" : "gray"
                    }
                    key={i}
                    onClick={() => paginationButtonHandler(i + 1)}
                  >
                    {i + 1}
                  </Button>
                );
              })}
              <Button
                colorScheme="blue"
                onClick={() => paginationButtonHandler(pagination.totalPages)}
                isDisabled={pagination.currentPage === pagination.totalPages}
              >
                <MdArrowRight size={30} />
              </Button>
            </Wrap>
          )}
        </Box>
      )}
    </>
  );
};

export default ProductsScreen;
