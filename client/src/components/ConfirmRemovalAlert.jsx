import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogOverlay,
  AlertDialogHeader,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

const ConfirmRemovalAlert = ({
  isOpen,
  onClose,
  cancelRef,
  itemToDelete,
  deleteAction,
}) => {
  const dispatch = useDispatch();
  const onDeleteItem = () => {
    dispatch(deleteAction(itemToDelete._id));
    onClose();
  };
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
            Delete {itemToDelete.name}
          </AlertDialogHeader>
          <AlertDialogBody>
            Continue? This action can't be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onclose}>
              Cancel
            </Button>
            <Button colorScheme="red" marginLeft={"3"} onClick={onDeleteItem}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmRemovalAlert;
