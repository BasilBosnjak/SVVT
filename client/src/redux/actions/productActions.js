import {
  setLoading,
  setError,
  setProducts,
  setPagination,
} from "../slices/product";
import axios from "axios";

export const getProducts = (page, favoriteToggle) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const { data: products } = await axios.get(`/api/products`);
    dispatch(setProducts(products));
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "An unexpected error occured, try again later!"
      )
    );
  }
};
