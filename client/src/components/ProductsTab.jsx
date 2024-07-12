import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
  Stack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  resetProductError,
} from "../redux/actions/productActions";
import ProductTableItem from "./ProductTableItem";
import CreateNewProduct from "./CreateNewProduct";

const ProductsTab = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.admin);
  const { products, productUpdate } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(resetProductError());
    if (productUpdate) {
      toast({
        description: "Product has been updated.",
        status: "success",
        isClosable: true,
      });
    }
  }, [dispatch, productUpdate, toast]);

  return (
    <Box>
      {error && (
        <Alert>
          <AlertIcon />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <Wrap justify={"center"}>
          <Stack direction={"row"} spacing={"4"}>
            <Spinner
              marginTop={"20"}
              thickness="2px"
              speed="0.7s"
              emptyColor="gray.200"
              color="cyan.500"
              size={"xl"}
            />
          </Stack>
        </Wrap>
      ) : (
        <Box>
          <Accordion allowToggle={true}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box textAlign={"right"} flex={"1"}>
                    <Box>
                      <Text marginRight={"8px"} fontWeight={"bold"}>
                        Add a new Product
                      </Text>
                    </Box>
                  </Box>
                </AccordionButton>
              </h2>
              <AccordionPanel paddingBottom={"4"}>
                <Table>
                  <Tbody>
                    <CreateNewProduct />
                  </Tbody>
                </Table>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Table variant={"striped"} size={"lg"}>
            <Thead>
              <Tr>
                <Th>Images</Th>
                <Th>Description</Th>
                <Th>Name & Brand</Th>
                <Th>Subtitle & StripeId</Th>
                <Th>Price & Category</Th>
                <Th>Stock & 'New' Badge</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.length > 0 &&
                products.map((product) => (
                  <ProductTableItem key={product._id} product={product} />
                ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default ProductsTab;
