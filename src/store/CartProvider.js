import { useReducer } from "react";
import CardContext from "./cart-context";

const ADD_CART_ITEM = "ADD_CART_ITEM";
const REMOVE_CART_ITEM = "REMOVE_CART_ITEM";

const defaultCartState = {
  items: [],
  totalAmount: 0, // total price
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_CART_ITEM: {
      const updatedTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      const existingCartItem = state.items[existingCartItemIndex];

      let updatedItems;

      if (existingCartItem) {
        //duplicated items
        const updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount + action.item.amount,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        // completely new item
        updatedItems = state.items.concat(action.item);
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }
    case REMOVE_CART_ITEM: {
      
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const existingCartItem = state.items[existingCartItemIndex];

      let updatedItem;
      let updatedItems;

      if (existingCartItem.amount === 1){ // remove item entirely
        updatedItems = state.items.filter(item => item.id !== action.id);
      } else {
        updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount - 1,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      }

      const updatedTotalAmount = state.totalAmount - existingCartItem.price;

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }
    default:
      return state;
  }
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  // action creator
  const addItemToCartHandler = (item) => {
    dispatchCartAction({
      type: ADD_CART_ITEM,
      item: item,
    });
  };

  // action creator
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({
      type: REMOVE_CART_ITEM,
      id: id,
    });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CardContext.Provider value={cartContext}>
      {props.children}
    </CardContext.Provider>
  );
};

export default CartProvider;
