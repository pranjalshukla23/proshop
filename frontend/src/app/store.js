import {configureStore} from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'
import usersReducer from '../features/users/userSlice'
import orderReducer from '../features/order/orderSlice'
//store
export const store  = configureStore({
  //add reducers
  reducer:{
    products: productsReducer,
    cart: cartReducer,
    users: usersReducer,
    order: orderReducer
  }
})
