import {
  Stack,
  Spinner,
  TableContainer,
  Alert,
  Thead,
  AlertIcon,
  AlertDescription,
  Th,
  Tbody,
  Tr,
  Button,
  ListItem,
  UnorderedList,
  Table,
  Td,
  AlertTitle,
  Wrap,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../redux/actions/userActions";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, userInfo, orders } = useSelector(
    (state) => state.user
  );
  const location = useLocation();

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserOrders());
    }
  }, [dispatch, userInfo]);

  return userInfo ? (
    <>
      {loading ? (
        <Wrap
          direction={"column"}
          align={"center"}
          marginTop={"20px"}
          justify={"center"}
          minHeight={"100vh"}
        >
          <Stack direction={"row"} spacing={"4"}>
            <Spinner
              marginTop={"20"}
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.200"
              color="cyan.500"
              size={"xl"}
            />
          </Stack>
        </Wrap>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Sorry :(</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        orders && (
          <TableContainer minHeight={"100vh"}>
            <Table variant={"striped"}>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Date</Th>
                  <Th>Total paid</Th>
                  <Th>Items</Th>
                  <Th>Receipt</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => {
                  <Tr key={order._id}>
                    <Td>{order._id}</Td>
                    <Td>{new Date(order.createdAt).toString()}</Td>
                    <Td>€{order.totalPrice}</Td>
                    <Td>
                      {order.orderItems.map((item) => (
                        <UnorderedList key={item._id}>
                          <ListItem>
                            {item.qty} x {item.name}
                          </ListItem>
                        </UnorderedList>
                      ))}
                    </Td>
                    <Td>
                      <Button variant={"outline"}>Receipt</Button>
                    </Td>
                  </Tr>;
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )
      )}
    </>
  ) : (
    <Navigate to={"/login"} replace={true} state={{ from: location }} />
  );
};

export default OrdersScreen;
