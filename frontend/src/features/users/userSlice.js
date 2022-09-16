import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const usersFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) :
    null;

//define the initial state
const initialState = {
  userInfo: usersFromStorage,
  loading: false,
  success: false,
  isUserDeleted: false,
  error: '',
  user: {},
  users: [],
  isUserUpdated: false,
  loadingUpdated: false,
  updateError: '',
};

//thunks
//thunks automatically execute extra reducers based on their status

//define thunk
export const login = createAsyncThunk('users/login',
    async ({email, password}, thunkAPI) => {

      try {

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const {data} = await axios.post('/api/users/login', {
              email,
              password,
            },
            config);
        console.log('data:', data);
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
export const register = createAsyncThunk('users/register',
    async ({name, email, password}, thunkAPI) => {

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const {data} = await axios.post('/api/users', {
              name,
              email,
              password,
            },
            config);
        console.log('data:', data);
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
export const getUserDetails = createAsyncThunk('users/getUserDetails',
    async (id, thunkAPI) => {

      try {

        console.log('id', id);

        console.log(thunkAPI.getState());
        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.get(`/api/users/${id}`, config);
        console.log('data:', data);
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
export const updateUserProfile = createAsyncThunk('users/updateUserProfile',
    async (user, thunkAPI) => {

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
        const {data} = await axios.put(`/api/users/profile`, user, config);
        console.log('data:', data);
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
export const deleteUser = createAsyncThunk('users/deleteUser',
    async (id, thunkAPI) => {

      try {

        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/users/${id}`, config);

      } catch (error) {

        console.log(error);

        const message = (error.response && error.response.data &&
                error.response.data.message)
            || error.message || error.toString();

        return thunkAPI.rejectWithValue(message);
      }
    });

//define thunk
export const getUsers = createAsyncThunk('users/getUsers',
    async (_, thunkAPI) => {

      try {

        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.get(`/api/users`, config);
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
export const updateUserDetails = createAsyncThunk('users/updateUserDetails',
    async (user, thunkAPI) => {

      try {

        //get state defined in redux using reducer name
        const {userInfo} = thunkAPI.getState().users;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.put(`/api/users/${user._id}`, user, config);
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
export const usersSlice = createSlice({

  //slice name
  name: 'users',

  //initial state
  initialState,

  //reducers
  //reducers contain the actions
  //reducers update the state based on actions
  reducers: {

    //action
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = {};
      state.users = {};
      state.user = {};
    },



  },

  //extra-reducers
  //extra-reducers get executed automatically based on the status of thunk
  extraReducers: (builder) => {

    builder
        //case 1
        //when status of thunk is pending
        .addCase(login.pending, (state, action) => {
          state.loading = true;
        })
        //case 2
        //when status of thunk is fulfilled
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
          localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        })
        //case 3
        //when status of thunk is rejected
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 4
        //when status of thunk is pending
        .addCase(register.pending, (state, action) => {
          state.loading = true;
        })
        //case 5
        //when status of thunk is fulfilled
        .addCase(register.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
          localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        })
        //case 6
        //when status of thunk is rejected
        .addCase(register.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 7
        //when status of thunk is pending
        .addCase(getUserDetails.pending, (state, action) => {
          state.loading = true;
        })
        //case 8
        //when status of thunk is fulfilled
        .addCase(getUserDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        //case 9
        //when status of thunk is rejected
        .addCase(getUserDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 10
        //when status of thunk is pending
        .addCase(updateUserProfile.pending, (state, action) => {
          state.loading = true;
        })
        //case 11
        //when status of thunk is fulfilled
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.userInfo = action.payload;
          localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        })
        //case 12
        //when status of thunk is rejected
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 13
        //when status of thunk is pending
        .addCase(getUsers.pending, (state, action) => {
          state.loading = true;
        })
        //case 14
        //when status of thunk is fulfilled
        .addCase(getUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.users = action.payload;
        })
        //case 15
        //when status of thunk is rejected
        .addCase(getUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        //case 13
        //when status of thunk is pending
        .addCase(deleteUser.pending, (state, action) => {
          state.loading = true;
          state.isUserDeleted = false;
        })
        //case 14
        //when status of thunk is fulfilled
        .addCase(deleteUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isUserDeleted = true;
        })
        //case 15
        //when status of thunk is rejected
        .addCase(deleteUser.rejected, (state, action) => {
          state.loading = false;
          state.isUserDeleted = false;
          state.error = action.payload;
        })
        //case 16
        //when status of thunk is pending
        .addCase(updateUserDetails.pending, (state, action) => {
          state.loadingUpdated = true;
          state.isUserUpdated = false;
        })
        //case 14
        //when status of thunk is fulfilled
        .addCase(updateUserDetails.fulfilled, (state, action) => {

          console.log("user updated")
          state.loadingUpdated = false;
          state.user = action.payload;
          state.isUserUpdated = true;
        })
        //case 15
        //when status of thunk is rejected
        .addCase(updateUserDetails.rejected, (state, action) => {
          state.loadingUpdated = false;
          state.isUserUpdated = false;
          state.updateError = action.payload;
        });
  },
});

//export redux actions
export const {logout} = usersSlice.actions;

//export redux reducers
export default usersSlice.reducer;
