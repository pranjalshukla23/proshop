import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

//define the initial state
const initialState = {
  order: {},
  loading: true,
  error: '',
  success: false,
  loadingPay: true,
  successPay: false,
  orders: [],
  loadingGetOrders: false,
  errorGetOrders: '',
  loadingDeliverOrder: false,
  errorDeliverOrder: '',
  deliverSuccess: false,
};

//thunks
//thunks automatically execute extra reducers based on their status

//define thunk
export const createOrder = createAsyncThunk('order/createOrder',
    async (order, thunkAPI) => {
      try {

        console.log(thunkAPI.getState());
        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.post(`/api/orders`, order,config)
        return data;

      } catch (error) {



        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const getOrderDetails = createAsyncThunk('order/getOrderDetails',
    async (id, thunkAPI) => {
      try {

        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.get(`/api/orders/${id}`,config);
        return data;

      } catch (error) {



        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const payOrder = createAsyncThunk('order/payOrder',
    async ({id, paymentResult}, thunkAPI) => {
      try {

        console.log("paymentResult: " + paymentResult)
        console.log(thunkAPI.getState());
        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.put(`/api/orders/${id}/pay`,paymentResult, config);
        return data;

      } catch (error) {


        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const getMyOrders = createAsyncThunk('order/getMyOrders',
    async (_, thunkAPI) => {
      try {

        console.log(thunkAPI.getState());
        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.get(`/api/orders/myorders`,config);
        return data;

      } catch (error) {


        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const deliverOrder = createAsyncThunk('order/deliverOrder',
    async (order, thunkAPI) => {
      try {

        console.log(thunkAPI.getState());
        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
        return data;

      } catch (error) {


        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const getOrders = createAsyncThunk('order/getOrders',
    async (_, thunkAPI) => {
      try {

        console.log(thunkAPI.getState());
        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.get(`/api/orders`,config);
        return data;

      } catch (error) {


        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define slice
export const orderSlice = createSlice({

  //slice name
  name: 'order',

  //initial state
  initialState,

  //reducers
  //reducers contain the actions
  //reducers update the state based on actions
  reducers: {
    reset: (state,payload) => {

      state.order = {}
      state.orders = {}
    }
  },

  //extra-reducers
  //extra-reducers get executed automatically based on the status of thunk
  extraReducers: (builder) => {

    builder
        //case 1
        //when status of thunk is pending
        .addCase(createOrder.pending, (state, action) => {
          state.loading = true;
          state.success = false;
        })
        //case 2
        //when status of thunk is fulfilled
        .addCase(createOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.order = action.payload;
        })
        //case 3
        //when status of thunk is rejected
        .addCase(createOrder.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload;
        })
        //case 4
        //when status of thunk is pending
        .addCase(getOrderDetails.pending, (state, action) => {
          state.loading = true;
        })
        //case 5
        //when status of thunk is fulfilled
        .addCase(getOrderDetails.fulfilled, (state, action) => {
          console.log("resetting orders")
          state.loading = false;
          state.order = action.payload
          state.order.orderItems = action.payload.orderItems;
          state.order.shippingAddress = action.payload.shippingAddress;
        })
        //case 6
        //when status of thunk is rejected
        .addCase(getOrderDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 7
        //when status of thunk is pending
        .addCase(payOrder.pending, (state, action) => {
          state.loadingPay = true;
          state.successPay = false;
        })
        //case 8
        //when status of thunk is fulfilled
        .addCase(payOrder.fulfilled, (state, action) => {
          state.loadingPay = false;
          state.order = action.payload;
          state.successPay = true
        })
        //case 9
        //when status of thunk is rejected
        .addCase(payOrder.rejected, (state, action) => {
          state.loadingPay = false;
          state.successPay = false;
          state.error = action.payload;
        })
        //case 10
        //when status of thunk is pending
        .addCase(getMyOrders.pending, (state, action) => {
          state.loading = true;
        })
        //case 11
        //when status of thunk is fulfilled
        .addCase(getMyOrders.fulfilled, (state, action) => {
          state.loading = false;
          state.orders = action.payload;

        })
        //case 12
        //when status of thunk is rejected
        .addCase(getMyOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 13
        //when status of thunk is pending
        .addCase(getOrders.pending, (state, action) => {
          state.loadingGetOrders = true;
        })
        //case 14
        //when status of thunk is fulfilled
        .addCase(getOrders.fulfilled, (state, action) => {

          state.loadingGetOrders = false;
          state.orders = action.payload;

        })
        //case 15
        //when status of thunk is rejected
        .addCase(getOrders.rejected, (state, action) => {
          state.loadingGetOrders = false;
          state.errorGetOrders = action.payload;
        })
        //case 17
        //when status of thunk is pending
        .addCase(deliverOrder.pending, (state, action) => {
          state.loadingDeliverOrder = true;
        })
        //case 18
        //when status of thunk is fulfilled
        .addCase(deliverOrder.fulfilled, (state, action) => {

          state.loadingDeliverOrder = false;
          state.order = action.payload;
          state.deliverSuccess = true;

        })
        //case 19
        //when status of thunk is rejected
        .addCase(deliverOrder.rejected, (state, action) => {
          state.loadingDeliverOrder = false;
          state.errorDeliverOrder = action.payload;
        })


  },
});

//export redux actions
export const {reset} = orderSlice.actions;

//export redux reducers
export default orderSlice.reducer;
