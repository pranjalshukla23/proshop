import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import {listProducts} from '../products/productsSlice';

//get data from local storage
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : ''

//define initial state
const initialState = {
  cartItems: cartItemsFromStorage,
  loading: false,
  error: '',
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage
}

//define thunks
//thunks automatically execute the extra reducers based on their status


//define thunk
export const addCartItem = createAsyncThunk('products/addCartItem',
    async ({id,qty}, thunkAPI) => {

      try {
        const {data} = await axios.get(`/api/products/${id}`);
        console.log(data);
        return {
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty
        };

      } catch (error) {

        console.log(error);

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });


//define slice
export const cartSlice = createSlice({

  //slice name
  name: 'cart',

  //initial state
  initialState,

  //reducers
  //reducers contain the actions
  //reducers modify the state based on actions
  reducers:{
    //action
    removeItem: (state,action) =>{
      const id = action.payload
      console.log("payload",action.payload)
      state.cartItems = state.cartItems.filter(x => x.product !== id)

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    //action
    saveShippingAddress: (state,action) =>{
      state.shippingAddress = action.payload
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload))
    },
    //action
    savePaymentMethod: (state,action) =>{
      state.paymentMethod = action.payload
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload))
    }
  },


  //extra-reducers
  //extra-reducers are executed automatically based on the status of thunk
  extraReducers: (builder) =>{
    builder
        //case 1
        //when status of thunk is pending
        .addCase(addCartItem.pending, (state, action) => {
          state.loading = true;
        })
        //case 2
        //when status of thunk is fulfilled
        .addCase(addCartItem.fulfilled, (state, action) => {
          state.loading = false;
          const item = action.payload;
          const existItem = state.cartItems.find(x => x.product === item.product)
          //console.log("exist item: " + existItem)
          localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
          if(existItem) {
            state.cartItems = state.cartItems.map(x => x.product === existItem.product ? item : x)
          }else{
            state.cartItems.push(item)
          }
        })
        //case 3
        //when status of thunk is rejected
        .addCase(addCartItem.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  }
})


//export redux actions
export const {removeItem, saveShippingAddress, savePaymentMethod} = cartSlice.actions

//export redux reducers
export default cartSlice.reducer
