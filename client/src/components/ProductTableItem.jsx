import { DeleteIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Td,
  Textarea,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteProduct, updateProduct } from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";

const ProductTableItem = ({ product }) => {
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const [brand, setBrand] = useState(product.brand);
  const [category, setCategory] = useState(product.category);
  const [stock, setStock] = useState(product.stock);
  const [price, setPrice] = useState(product.price);
  const [productIsNew, setProductIsNew] = useState(product.productIsNew);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [subtitle, setSubtitle] = useState(product.subtitle);
  const [stripeId, setStripeId] = useState(product.stripeId);
  const [imageOne, setImageOne] = useState(product.images[0]);
  const [imageTwo, setImageTwo] = useState(product.images[1]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const onSaveProduct = () => {
    dispatch(
      updateProduct(
        product._id,
        brand,
        category,
        stock,
        price,
        productIsNew,
        name,
        description,
        subtitle,
        stripeId,
        imageOne,
        imageTwo
      )
    );
  };

  const openConfirmDeleteBox = () => {
    onOpen();
  };

  return (
    <>
      <Tr>
        <Td>
          <Flex direction={"column"} gap={"2"}>
            <Input
              value={imageOne}
              onChange={(e) => setImageOne(e.target.value)}
              size={"sm"}
            />
            <Input
              value={imageTwo}
              onChange={(e) => setImageTwo(e.target.value)}
              size={"sm"}
            />
          </Flex>
        </Td>
        <Td>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            width={"270px"}
            height={"120px"}
            size={"sm"}
          />
        </Td>
        <Td>
          <Flex direction={"column"} gap={"2"}>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              size={"sm"}
            />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              size={"sm"}
            />
          </Flex>
        </Td>
        <Td>
          <Flex direction={"column"} gap={"2"}>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              size={"sm"}
            />
            <Input
              value={stripeId}
              onChange={(e) => setStripeId(e.target.value)}
              size={"sm"}
            />
          </Flex>
        </Td>
        <Td>
          <Flex direction={"column"} gap={"2"}>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size={"sm"}
            />
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              size={"sm"}
            />
          </Flex>
        </Td>
        <Td>
          <Flex direction={"column"} gap={"2"}>
            <Input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              size={"sm"}
            />
            <FormControl display={"flex"} alignItems={"center"}>
              <FormLabel
                htmlFor="productIsNewFlag"
                marginBottom={0}
                fontSize={"sm"}
              >
                Enable
                <Badge
                  paddingX={"1"}
                  marginX={"1"}
                  rounded={"full"}
                  colorScheme="green"
                  fontSize={"0.8em"}
                >
                  New
                </Badge>
              </FormLabel>
              <Switch
                id="productIsNewFlag"
                onChange={() => setProductIsNew(!productIsNew)}
                isChecked={productIsNew}
              />
            </FormControl>
          </Flex>
        </Td>
        <Td>
          <VStack>
            <Button
              colorScheme="red"
              width={"160px"}
              variant={"outline"}
              onClick={openConfirmDeleteBox}
            >
              <DeleteIcon marginRight={"5px"} />
              Remove Product
            </Button>
            <Button
              colorScheme="green"
              width={"160px"}
              variant={"outline"}
              onClick={onSaveProduct}
            >
              <MdOutlineDataSaverOn
                style={{ marginRight: "5px", height: "25px", width: "25px" }}
              />
              Update Product
            </Button>
          </VStack>
        </Td>
      </Tr>
      <ConfirmRemovalAlert
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        cancelRef={cancelRef}
        itemToDelete={product}
        deleteAction={deleteProduct}
      />
    </>
  );
};

export default ProductTableItem;
