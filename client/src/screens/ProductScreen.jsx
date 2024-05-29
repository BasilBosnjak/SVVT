import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../redux/actions/productActions";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Spinner,
  Stack,
  Wrap,
  Box,
  AlertIcon,
  Badge,
  Heading,
  Text,
  HStack,
  Flex,
  Button,
  Image,
  SimpleGrid,
  useToast,
  Textarea,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import Star from "../components/Star";
import { MinusIcon, PlusIcon, SmallAddIcon } from "@chakra-ui/icons";
import { BiCheckShield, BiPackage, BiSupport } from "react-icons/bi";
import { addCartItem } from "../redux/actions/cartActions";
import { createProductReview } from "../redux/actions/productActions";

const ProductScreen = () => {
  let [amount, setAmount] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, product, reviewed } = useSelector(
    (state) => state.product
  );
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const toast = useToast();
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(1);
  const [reviewBoxOpen, setReviewBoxOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    dispatch(getProduct(id));
    setReviewBoxOpen(false);
    if (reviewed) {
      toast({
        description: "Product review saved.",
        status: "success",
        isClosable: true,
      });
      setReviewBoxOpen(false);
    }
  }, [dispatch, id, reviewed, toast]);

  const changeAmount = (input) => {
    if (input === "plus") {
      setAmount((prevAmount) => prevAmount + 1);
    } else if (input === "minus") {
      setAmount((prevAmount) => prevAmount - 1);
    }
  };

  const addItem = () => {
    if (cartItems.some((cartItem) => cartItem.id === id)) {
      const item = cartItems.find((cartItem) => cartItem.id === id);
      dispatch(addCartItem(id, item.qty + amount));
    } else {
      dispatch(addCartItem(id, amount));
    }
    toast({
      description: "Item has been added",
      status: "success",
      isClosable: true,
    });
  };

  const hasUserReviewed = () => {
    product.reviews.some((item) => item.user === userInfo._id);
  };
  const handleSubmit = () => {
    setButtonLoading(true);
    dispatch(
      createProductReview(product._id, userInfo._id, comment, rating, title)
    );
  };

  return (
    <Wrap spacing={"30px"} justify={"center"} minHeight={"100vh"}>
      {loading ? (
        <Stack spacing={4} direction={"row"}>
          <Spinner
            marginTop={"20"}
            thickness="2px"
            speed="0.55s"
            emptyColor="gray.300"
            color="cyan.500"
            size={"xl"}
          />
        </Stack>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Sorry :(</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        product && (
          <Box
            maxWidth={{ base: "3xl", lg: "5xl" }}
            mx={"auto"}
            paddingX={{ base: "4", md: "8", lg: "12" }}
            paddingY={{ base: "6", md: "8", lg: "12" }}
          >
            <Stack
              direction={{ base: "column", lg: "row" }}
              align={"flex-start"}
            >
              <Stack
                paddingRight={{ base: 0, md: "row" }}
                flex={"1.5"}
                marginBottom={{ base: "12", md: "none" }}
              >
                {product.productIsNew && (
                  <Badge
                    padding={"2"}
                    rounded={"md"}
                    width={"50px"}
                    fontSize={"0.8em"}
                    colorScheme="green"
                  >
                    New
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge
                    rounded={"full"}
                    width={"70px"}
                    fontSize={"0.8em"}
                    colorScheme="red"
                  >
                    Sold out
                  </Badge>
                )}
                <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
                  {`${product.brand} ${product.name}`}
                </Heading>
                <Stack spacing={"5"}>
                  <Box>
                    <Text fontSize={"xl"}>€{product.price}</Text>
                    <Flex>
                      <HStack spacing={"2"}>
                        <Star color={"cyan.500"} />
                        <Star rating={product.rating} star={2} />
                        <Star rating={product.rating} star={3} />
                        <Star rating={product.rating} star={4} />
                        <Star rating={product.rating} star={5} />
                      </HStack>
                      <Text
                        fontSize={"medium"}
                        fontWeight={"bold"}
                        marginLeft={"4px"}
                      >
                        {product.numberOfReviews} Reviews
                      </Text>
                    </Flex>
                  </Box>
                  <Text>{product.subtitle}</Text>
                  <Text>{product.description}</Text>
                  <Text fontWeight={"bold"}>Quantity</Text>
                  <Flex
                    width={"170px"}
                    padding={"5px"}
                    border={"1px"}
                    borderColor={"gray.300"}
                    alignItems={"center"}
                  >
                    <Button
                      isDisabled={amount <= 1}
                      onClick={() => changeAmount("minus")}
                    >
                      <MinusIcon />
                    </Button>
                    <Text marginX={"30px"}>{amount}</Text>
                    <Button
                      isDisabled={amount >= product.stock}
                      onClick={() => changeAmount("plus")}
                    >
                      <SmallAddIcon />
                    </Button>
                  </Flex>
                  <Badge
                    fontSize={"large"}
                    width={"170px"}
                    textAlign={"center"}
                    colorScheme={"gray"}
                  >
                    In Stock: {product.stock}
                  </Badge>
                  <Button
                    variant={"outline"}
                    isDisabled={product.stock === 0}
                    colorScheme="cyan"
                    width={"50%"}
                    alignSelf={"center"}
                    onClick={() => addItem()}
                  >
                    Add to cart
                  </Button>
                  <Stack width={"270px"}>
                    <Flex alignItems={"center"}>
                      <BiPackage size={"20px"} />
                      <Text
                        fontWeight={"medium"}
                        fontSize={"small"}
                        marginLeft={"2"}
                      >
                        Express delivery within 48 hours
                      </Text>
                    </Flex>
                    <Flex alignItems={"center"}>
                      <BiCheckShield size={"20px"} />
                      <Text
                        fontWeight={"medium"}
                        fontSize={"small"}
                        marginLeft={"2"}
                      >
                        Now offering extended warranty
                      </Text>
                    </Flex>
                    <Flex alignItems={"center"}>
                      <BiSupport size={"20px"} />
                      <Text
                        fontWeight={"medium"}
                        fontSize={"small"}
                        marginLeft={"2"}
                      >
                        We provide 24/7 customer support
                      </Text>
                    </Flex>
                  </Stack>
                </Stack>
              </Stack>
              <Flex
                direction={"column"}
                align={"center"}
                flex={1}
                _dark={{ bg: "gray.900" }}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fallbackSrc={"https://via.placeholder.com/250"}
                  marginBottom={"30px"}
                />
                <Image
                  src={product.images?.[1]}
                  alt={product.name}
                  fallbackSrc={"https://via.placeholder.com/250"}
                  marginBottom={"30px"}
                />
              </Flex>
            </Stack>
            {userInfo && (
              <>
                <Tooltip
                  label={
                    hasUserReviewed() &&
                    "you have already reviewed this product."
                  }
                  fontSize={"medium"}
                >
                  <Button
                    isDisabled={hasUserReviewed()}
                    marginY={"20px"}
                    width={"150px"}
                    colorScheme="cyan"
                    onClick={() => setReviewBoxOpen(!reviewBoxOpen)}
                  >
                    Leave a review
                  </Button>
                </Tooltip>
                {reviewBoxOpen && (
                  <Stack marginBottom={"20px"}>
                    <Wrap>
                      <HStack spacing={"3px"}>
                        <Button
                          variant={"outline"}
                          onClick={() => setRating(1)}
                        >
                          <Star rating={rating} star={1} />
                        </Button>
                        <Button
                          variant={"outline"}
                          onClick={() => setRating(2)}
                        >
                          <Star rating={rating} star={2} />
                        </Button>
                        <Button
                          variant={"outline"}
                          onClick={() => setRating(3)}
                        >
                          <Star rating={rating} star={3} />
                        </Button>
                        <Button
                          variant={"outline"}
                          onClick={() => setRating(4)}
                        >
                          <Star rating={rating} star={4} />
                        </Button>
                        <Button
                          variant={"outline"}
                          onClick={() => setRating(5)}
                        >
                          <Star rating={rating} star={5} />
                        </Button>
                      </HStack>
                    </Wrap>
                    <Input
                      placeholder={`Review title (optional): `}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder={`Leave your review here...`}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      isLoading={buttonLoading}
                      loadingText={`Saving...`}
                      width={"150px"}
                      onClick={() => handleSubmit()}
                      colorScheme="cyan"
                    >
                      Create review
                    </Button>
                  </Stack>
                )}
              </>
            )}
            <Stack>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                Reviews
              </Text>
              <SimpleGrid
                minChildWidth={"300px"}
                spacingX={"40px"}
                spacingY={"20px"}
              >
                {product.reviews.map((review) => (
                  <Box key={review._id}>
                    <Flex spacing={"2px"} alignItems={"center"}>
                      <Text fontWeight={"semibold"}>
                        {review.title && review.title}
                      </Text>
                    </Flex>
                    <Box paddingY={"12px"}>{review.comment}</Box>
                    <Text color={"gray.500"} fontSize={"small"}>
                      {`by ${review.name}  
                      ${new Date(review.createdAt).toDateString()}`}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Stack>
          </Box>
        )
      )}
    </Wrap>
  );
};

export default ProductScreen;
