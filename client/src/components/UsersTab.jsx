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
} from "@chakra-ui/react";
import { DeleteIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  resetErrorAndRemoval,
} from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";

const UsersTab = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef();
  const [userToDelete, setUserToDelete] = useState("");
  const dispatch = useDispatch();
  const { error, loading, userRemoval, userList } = useSelector(
    (state) => state.admin
  );
  const toast = useToast();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(resetErrorAndRemoval());
    if (userRemoval) {
      toast({
        description: "User has been removed!",
        status: "success",
        isClosable: true,
      });
    }
  }, [dispatch, toast, userRemoval]);

  const openConfirmDeleteBox = (user) => {
    setUserToDelete(user);
    onOpen();
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
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Registered</Th>
                  <Th>Admin</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userList &&
                  userList.map((user) => (
                    <Tr key={user._id}>
                      <Td>
                        {user.name} {user._id === userInfo._id ? `(YOU)` : ``}
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>{new Date(user.createdAt).toDateString()}</Td>
                      <Td>
                        {user.isAdmin ? (
                          <CheckCircleIcon color={"greenyellow"} />
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td>
                        <Button
                          isDisabled={user._id === userInfo._id}
                          variant={"outline"}
                          onClick={() => openConfirmDeleteBox(user)}
                        >
                          Remove User
                        </Button>
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
            itemToDelete={userToDelete}
            deleteAction={deleteUser}
          />
        </Box>
      )}
    </Box>
  );
};

export default UsersTab;
