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
  Text,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteOrder,
  resetErrorAndRemoval,
  setDelivered,
} from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";
import { TbTruckDelivery } from "react-icons/tb";

const OrdersTab = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef();
  const [orderToDelete, setOrderToDelete] = useState("");
  const dispatch = useDispatch();
  const { error, loading, orders, orderRemoval, deliveredFlag } = useSelector(
    (state) => state.admin
  );
  const toast = useToast();

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(resetErrorAndRemoval());
    if (orderRemoval) {
      toast({
        description: "Order has been removed!",
        status: "success",
        isClosable: true,
      });
    }
    if (deliveredFlag) {
      toast({
        description: "Order has been set to delivered!",
        status: "success",
        isClosable: true,
      });
    }
  }, [dispatch, toast, orderRemoval, deliveredFlag]);

  const openConfirmDeleteBox = (order) => {
    setOrderToDelete(order);
    onOpen();
  };

  const onSetDelivered = (order) => {
    dispatch(setDelivered(order._id));
    dispatch(resetErrorAndRemoval());
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
          <TableContainer>
            <Table variant={"striped"}>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Shipping Address</Th>
                  <Th>Items Ordered</Th>
                  <Th>Shipping Price</Th>
                  <Th>Total</Th>
                  <Th>Delivered</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders &&
                  orders.map((order) => (
                    <Tr key={order._id}>
                      <Td>{new Date(order.createdAt).toDateString()}</Td>
                      <Td>{order.username}</Td>
                      <Td>{order.email}</Td>
                      <Td>
                        <Text>
                          <i>Address: </i> {order.shippingAddress.address}
                        </Text>
                        <Text>
                          <i>City: </i> {order.shippingAddress.postalCode}
                          {order.shippingAddress.city}
                        </Text>
                        <Text>
                          <i>Country: </i> {order.shippingAddress.country}
                        </Text>
                      </Td>
                      <Td>
                        {order.orderItems.map((item) => (
                          <Text key={item._id}>
                            {item.qty} x {item.name}
                          </Text>
                        ))}
                      </Td>
                      <Td>€{order.shippingPrice}</Td>
                      <Td>€{order.totalPrice}</Td>
                      <Td>
                        {order.isDelivered ? (
                          <CheckCircleIcon color={"greenyellow"} />
                        ) : (
                          "NO"
                        )}
                      </Td>
                      <Td>
                        <Flex direction={"column"}>
                          <Button
                            variant={"outline"}
                            onClick={() => openConfirmDeleteBox(order)}
                          >
                            <DeleteIcon marginRight={"5px"} />
                            Remove Order
                          </Button>
                          {!order.isDelivered && (
                            <Button
                              variant={"outline"}
                              marginTop={"5px"}
                              onClick={() => onSetDelivered(order)}
                            >
                              <TbTruckDelivery />
                              <Text marginLeft={"5px"}>Delivered</Text>
                            </Button>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
          <ConfirmRemovalAlert
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            cancelRef={cancelRef}
            itemToDelete={orderToDelete}
            deleteAction={deleteOrder}
          />
        </Box>
      )}
    </Box>
  );
};

export default OrdersTab;
