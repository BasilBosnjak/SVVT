import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@chakra-ui/react";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { toggleFavorites } from "../redux/actions/productActions";

export const Header = () => {
  const dispatch = useDispatch();
  const { favoritesToggled } = useSelector((state) => state.product);
  return (
    <>
      {favoritesToggled ? (
        <IconButton
          icon={<MdOutlineFavorite size={20} />}
          onClick={() => dispatch(toggleFavorites(false))}
          variant={"ghost"}
        />
      ) : (
        <IconButton
          icon={<MdOutlineFavoriteBorder size={20} />}
          onClick={() => dispatch(toggleFavorites(true))}
          variant={"ghost"}
        />
      )}
    </>
  );
};
