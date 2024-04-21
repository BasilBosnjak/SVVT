import { Link as ReactLink } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";

const NavLink = ({ route, children }) => {
  return (
    <IconButton
      as={ReactLink}
      to={route}
      paddingX={2}
      paddingY={1}
      rounded={"md"}
      variant={"ghost"}
    >
      {children}
    </IconButton>
  );
};

export default NavLink;
