import {
  Tr,
  Td,
  Button,
  VStack,
  Textarea,
  Tooltip,
  Input,
  FormControl,
  Switch,
  FormLabel,
  Text,
  Badge,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/actions/adminActions";

const CreateNewProduct = () => {
  const dispatch = useDispatch();
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [productIsNew, setProductIsNew] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [stripeId, setStripeId] = useState("");

  const createNewProduct = () => {
    dispatch(
      createProduct({
        brand,
        name,
        category,
        stock,
        price,
        images: [`/images/${imageOne}`, `/images/${imageTwo}`],
        productIsNew,
        description,
        subtitle,
        stripeId,
      })
    );
  };

  return (
    <Tr>
      <Td>
        <Text fontSize={"small"}>Image file name no. 1</Text>
        <Tooltip
          label={"Set the name of the first image eg. Samsung.jpg"}
          fontSize={"small"}
        >
          <Input
            size={"sm"}
            value={imageOne}
            onChange={(e) => setImageOne(e.target.value)}
          />
        </Tooltip>
        <Spacer />
        <Text fontSize={"small"}>Image file name no. 2</Text>
        <Tooltip
          label={"Set the name of the second image eg. alt-image.jpg"}
          fontSize={"small"}
        >
          <Input
            size={"sm"}
            value={imageTwo}
            onChange={(e) => setImageTwo(e.target.value)}
          />
        </Tooltip>
      </Td>
      <Td>
        <Text fontSize={"small"}>Description</Text>
        <Textarea
          value={description}
          width={"270px"}
          height={"120px"}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
          size={"sm"}
        />
      </Td>
      <Td>
        <Text fontSize={"small"}>Brand</Text>
        <Input
          size={"sm"}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Samsung..."
        />
        <Text fontSize={"small"}>Name</Text>
        <Input
          size={"sm"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="S 23 Ultra..."
        />
      </Td>
      <Td>
        <Text fontSize={"small"}>Subtitle</Text>
        <Input
          size={"sm"}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Samsung Galaxy S23 256GB..."
        />
        <Text fontSize={"small"}>StripeId</Text>
        <Input
          size={"sm"}
          value={stripeId}
          onChange={(e) => setStripeId(e.target.value)}
          placeholder="price_00000000000..."
        />
      </Td>
      <Td>
        <Text fontSize={"small"}>Category</Text>
        <Input
          size={"sm"}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Smartphone"
        />
        <Text fontSize={"small"}>Price</Text>
        <Input
          size={"sm"}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="1299..."
        />
      </Td>
      <Td>
        <Text fontSize={"small"}>Stock</Text>
        <Input
          size={"sm"}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="20"
        />
        <Text fontSize={"small"}>New badge on product card</Text>
        <FormControl display={"flex"} alignItems={"center"}>
          <FormLabel
            htmlFor="productIsNewFlag"
            marginBottom={"0"}
            fontSize={"small"}
          >
            Enable
          </FormLabel>
          <Badge
            rounded={"full"}
            paddingX={"1"}
            marginX={"1"}
            fontSize={"0.8em"}
            colorScheme="green"
          >
            New
          </Badge>
          <Switch
            id="productIsNewFlag"
            defaultValue={productIsNew}
            onChange={() => setProductIsNew(!productIsNew)}
          />
        </FormControl>
      </Td>
      <Td>
        <VStack>
          <Button
            variant={"outline"}
            colorScheme="cyan"
            onClick={createNewProduct}
            width={"160px"}
          >
            <Text marginLeft={"2"}>Create Product</Text>
          </Button>
        </VStack>
      </Td>
    </Tr>
  );
};

export default CreateNewProduct;
