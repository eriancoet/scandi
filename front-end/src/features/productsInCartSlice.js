import { createSlice } from "@reduxjs/toolkit";

export const productsInCartSlice = createSlice({
  name: "productsInCart",
  initialState: [],
  reducers: {
    addProductToCart: (state, action) => {
      const { id, inStock, selectedAttr } = action.payload;

      if (!inStock) {
        return [...state];
      }

      const productIndex = state.findIndex(
        (product) =>
          product.id === id &&
          JSON.stringify(product.selectedAttr) === JSON.stringify(selectedAttr)
      );

      if (productIndex !== -1) {
        state[productIndex].amount += 1;
        return state;
      }

      return [
        ...state,
        {
          cartId: `${id}-${Math.floor(Math.random() * 1000000)}`,
          ...action.payload,
          amount: 1,
        },
      ];

    },

    modifyProductInCart: (state, action) => {
      const { cartId, attributes } = action.payload;

      const productIndex = state.findIndex((obj) => obj.cartId === cartId);
      if (productIndex === -1) {
        return state;
      }
      const product = state[productIndex];
      Object.keys(attributes).forEach((key) => {
        product.selectedAttr[key] = attributes[key];
      });

      const SecondProductIndex = state.findIndex(
        (obj) =>
          obj.id === product.id &&
          obj.cartId !== product.cartId &&
          JSON.stringify(obj.selectedAttr) ===
          JSON.stringify(product.selectedAttr)
      );

      if (SecondProductIndex === -1) {
        state[productIndex] = { ...product };
      } else {
        state[SecondProductIndex].amount += product.amount;
        state.splice(productIndex, 1);
      }

      return state;
    },

    addOneToProduct: (state, action) => {
      const cartId = action.payload.cartId;
      const productIndex = state.findIndex((obj) => obj.cartId === cartId);

      if (productIndex !== -1) {
        state[productIndex].amount += 1;
      }

      return state;
    },

    subtractOneFromProduct: (state, action) => {
      const cartId = action.payload.cartId;
      const productIndex = state.findIndex((obj) => obj.cartId === cartId);
      if (state[productIndex].amount === 1) {
        state.splice(productIndex, 1);
      } else {
        state[productIndex].amount -= 1;
      }
      return state;
    },
  },
});

export const {
  addProductToCart,
  addOneToProduct,
  subtractOneFromProduct,
  modifyProductInCart,
} = productsInCartSlice.actions;

export default productsInCartSlice.reducer;
