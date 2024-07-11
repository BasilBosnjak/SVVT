import axios from "axios";
import {
  setProducts,
  setProductUpdateFlag,
  setReviewRemovalFlag,
} from "../slices/product";
import {
  resetError,
  setDeliveredFlag,
  getOrders,
  getUsers,
  setError,
  setLoading,
  userDelete,
  orderDelete,
} from "../slices/admin";

export const getAllUsers = () => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.get(`api/users`, config);
    dispatch(getUsers(data));
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

export const deleteUser = (id) => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.delete(`api/users/${id}`, config);
    dispatch(userDelete(data));
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

export const getAllOrders = () => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.get(`api/orders`, config);
    dispatch(getOrders(data));
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

export const deleteOrder = (id) => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.delete(`api/orders/${id}`, config);
    dispatch(orderDelete(data));
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

export const setDelivered = (id) => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    await axios.put(`api/orders/${id}`, config);
    dispatch(setDeliveredFlag(true));
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

export const resetErrorAndRemoval = () => async (dispatch) => {
  dispatch(resetError());
};

export const updateProduct =
  (category, brand, name, productIsNew, stock, price, id, description) =>
  async (dispatch, getState) => {
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-type": "application/json",
      },
    };

    try {
      await axios.put(
        `api/products`,
        { category, brand, name, productIsNew, stock, price, id, description },
        config
      );
      dispatch(setProductUpdateFlag());
      dispatch(setProducts());
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

export const deleteProduct = (id) => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.delete(`api/products/${id}`, config);
    dispatch(setProducts(data));
    dispatch(setProductUpdateFlag());
    dispatch(resetError());
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

export const createProduct = (newProduct) => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(`api/products`, { newProduct }, config);
    dispatch(setProducts(data));
    dispatch(setProductUpdateFlag());
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

export const removeReview = (id, reviewId) => async (dispatch, getState) => {
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-type": "application/json",
    },
  };

  try {
    const { data } = await axios.put(
      `api/products/${id}/${reviewId}`,
      {},
      config
    );
    dispatch(setProducts(data));
    dispatch(setReviewRemovalFlag());
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
