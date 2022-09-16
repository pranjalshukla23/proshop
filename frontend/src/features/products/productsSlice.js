import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

//define the initial state
const initialState = {
  products: [],
  product: {
    reviews: [],
  },
  loading: false,
  error: '',
  productDeleted: false,
  loadingDelete: false,
  errorDelete: '',
  loadingCreateProduct: false,
  errorCreateProduct: '',
  createdProduct: {},
  isProductCreated: false,
  loadingUpdatedProduct: false,
  errorUpdatedProduct: '',
  isProductUpdated: false,
  loadingReview: false,
  isReviewed: false,
  errorReview: '',
  pages: '',
  page: '',
  topProducts: [],
  loadingTopProducts: false,
  errorTopProducts: ''
};

//thunks
//thunks automatically execute extra reducers based on their status

//define thunk
export const listProducts = createAsyncThunk('products/getProducts',
    async ({keyword='',pageNumber=1}, thunkAPI) => {

      try {
        console.log(pageNumber)
        const {data} = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);
        console.log("fetched data:", data)
        return data;

      } catch (error) {

        console.log(error);

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const getProductDetails = createAsyncThunk('products/getProductDetails',
    async (id, thunkAPI) => {

      try {
        const {data} = await axios.get(`/api/products/${id}`);
        console.log(data);
        return data;

      } catch (error) {

        console.log(error);

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const createProduct = createAsyncThunk('products/createProduct',
    async (_, thunkAPI) => {

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
        const {data} = await axios.post(`/api/products`, {}, config);

        return data

      } catch (error) {

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const deleteProduct = createAsyncThunk('products/deleteProduct',
    async (id, thunkAPI) => {

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
        await axios.delete(`/api/products/${id}`, config);

      } catch (error) {

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const updateProduct = createAsyncThunk('products/updateProduct',
    async (product, thunkAPI) => {

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
        const {data} = await axios.put(`/api/products/${product._id}`, product, config);

        return data

      } catch (error) {

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const createProductReview = createAsyncThunk('products/createProductReview',
    async ({id, review}, thunkAPI) => {

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
        await axios.post(`/api/products/${id}/reviews`, review, config);


      } catch (error) {

        console.log(error);

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const getTopProducts = createAsyncThunk('products/getTopProducts',
    async (_, thunkAPI) => {

      try {

        const {data} = await axios.get(`/api/products/top`);
        console.log("top products:",data);
        return data;

      } catch (error) {

        console.log(error);

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define slice
export const productsSlice = createSlice({

  //slice name
  name: 'products',

  //initial state
  initialState,

  //reducers
  //reducers contain the actions
  //reducers update the state based on actions
  reducers: {
    reset: (state, action) =>{

      state.isProductUpdated = false
      state.product = {}
      state.isProductCreated = false
      state.createdProduct = {}
    }
  },

  //extra-reducers
  //extra-reducers get executed automatically based on the status of thunk
  extraReducers: (builder) => {

    builder
        //case 1
        //when status of thunk is pending
        .addCase(listProducts.pending, (state, action) => {
          state.loading = true;
        })
        //case 2
        //when status of thunk is fulfilled
        .addCase(listProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload.products;
          state.pages = action.payload.pages;
          state.page = action.payload.page;
        })
        //case 3
        //when status of thunk is rejected
        .addCase(listProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 4
        //when status of thunk is pending
        .addCase(getProductDetails.pending, (state, action) => {
          state.loading = true;
        })
        //case 5
        //when status of thunk is fulfilled
        .addCase(getProductDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.product = action.payload;
        })
        //case 6
        //when status of thunk is rejected
        .addCase(getProductDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 7
        //when status of thunk is pending
        .addCase(deleteProduct.pending, (state, action) => {
          state.loadingDelete = true;
          state.productDeleted = false;
        })
        //case 8
        //when status of thunk is fulfilled
        .addCase(deleteProduct.fulfilled, (state, action) => {
          state.loadingDelete = false;
          state.productDeleted = true
        })
        //case 9
        //when status of thunk is rejected
        .addCase(deleteProduct.rejected, (state, action) => {
          state.loading = false;
          state.productDeleted = false
          state.errorDelete = action.payload;
        })
        //case 10
        //when status of thunk is pending
        .addCase(createProduct.pending, (state, action) => {
          state.loadingCreateProduct = true;
        })
        //case 11
        //when status of thunk is fulfilled
        .addCase(createProduct.fulfilled, (state, action) => {
          state.loadingCreateProduct = false;
          state.createdProduct = action.payload;
          state.isProductCreated = true

        })
        //case 12
        //when status of thunk is rejected
        .addCase(createProduct.rejected, (state, action) => {
          state.loadingCreateProduct = false;
          state.errorCreateProduct = action.payload;
        })
        //case 13
        //when status of thunk is pending
        .addCase(updateProduct.pending, (state, action) => {
          state.loadingUpdatedProduct = true;
          state.isProductUpdated = false;
        })
        //case 14
        //when status of thunk is fulfilled
        .addCase(updateProduct.fulfilled, (state, action) => {
          state.loadingUpdatedProduct = false;
          state.product = action.payload;
          state.isProductUpdated = true

        })
        //case 15
        //when status of thunk is rejected
        .addCase(updateProduct.rejected, (state, action) => {
          state.loadingUpdatedProduct = false;
          state.errorUpdatedProduct = action.payload;
          state.isProductUpdated = false
        })
        //case 16
        //when status of thunk is pending
        .addCase(createProductReview.pending, (state, action) => {
          state.loadingReview = true
          state.isReviewed = false
        })
        //case 17
        //when status of thunk is fulfilled
        .addCase(createProductReview.fulfilled, (state, action) => {
          state.loadingReview = false;
          state.isReviewed = true

        })
        //case 18
        //when status of thunk is rejected
        .addCase(createProductReview.rejected, (state, action) => {
          state.loadingReview = false;
          state.isReviewed = false
          state.errorReview = action.payload;

        })
        //case 19
        //when status of thunk is pending
        .addCase(getTopProducts.pending, (state, action) => {
          state.loadingTopProducts= true

        })
        //case 20
        //when status of thunk is fulfilled
        .addCase(getTopProducts.fulfilled, (state, action) => {
          state.loadingTopProducts = false;
          state.topProducts = action.payload

        })
        //case 21
        //when status of thunk is rejected
        .addCase(getTopProducts.rejected, (state, action) => {
          state.loadingTopProducts = false;
          state.errorTopProducts = action.payload

        });
  },
});

//export redux actions
export const {reset} = productsSlice.actions;

//export redux reducers
export default productsSlice.reducer;
