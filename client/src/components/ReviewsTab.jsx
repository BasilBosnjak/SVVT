import {
  Box,
  Table,
  Th,
  Tr,
  Td,
  TableContainer,
  Thead,
  Tbody,
  Button,
  useDisclosure,
  Alert,
  Stack,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Wrap,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  resetErrorAndRemoval,
} from "../redux/actions/adminActions";
import { getProducts } from "../redux/actions/productActions";
import { removeReview } from "../redux/actions/adminActions";

const ReviewsTab = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.admin);
  const toast = useToast();
  const { products, reviewRemoval } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
    if (reviewRemoval) {
      toast({
        description: "Review has been removed!",
        status: "success",
        isClosable: true,
      });
    }
  }, [dispatch, toast, reviewRemoval, loading]);

  const onRemoveReview = (id, reviewId) => {
    dispatch(removeReview(id, reviewId));
  };

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
          {products.length > 0 &&
            products.map((product) => (
              <Box key={product._id}>
                <Accordion allowToggle={true}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex={"1"}>
                          <Flex>
                            <Text marginRight={"8px"} fontWeight={"bold"}>
                              {product.name}
                            </Text>
                            <Spacer />
                            <Text marginRight={"8px"} fontWeight={"bold"}>
                              {product.reviews.length} Reviews
                            </Text>
                          </Flex>
                        </Box>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel paddingBottom={"4"}>
                      <TableContainer>
                        <Table size={"sm"}>
                          <Thead>
                            <Tr>
                              <Th>Username</Th>
                              <Th>Rating</Th>
                              <Th>Title</Th>
                              <Th>Comment</Th>
                              <Th>Created</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {product.reviews.map((review) => (
                              <Tr key={review._id}>
                                <Td>{review.name}</Td>
                                <Td>{review.rating}</Td>
                                <Td>{review.title}</Td>
                                <Td>
                                  <Textarea
                                    isDisabled={true}
                                    value={review.comment}
                                    size={"sm"}
                                  />
                                </Td>
                                <Td>
                                  {new Date(review.createdAt).toDateString()}
                                </Td>
                                <Td>
                                  <Button
                                    colorScheme="red"
                                    variant={"outline"}
                                    onClick={() =>
                                      onRemoveReview(product._id, review._id)
                                    }
                                  >
                                    Remove Review
                                  </Button>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default ReviewsTab;
