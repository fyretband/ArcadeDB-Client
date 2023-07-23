import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { saveLoginData } from "../config/storage";
import { BASE_URL } from "../config/api";
import phoneLocation from "../helpers/phoneLocation";
export const fetchGame = createAsyncThunk("games/fetchGame", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/games`);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
export const fetchArcadeDetail = createAsyncThunk(
  "games/fetchGameDetail",
  async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/detail/${id}`);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const fetchArcade = createAsyncThunk("games/fetchArcade", async () => {
  try {
    const userLocationData = await phoneLocation();
    console.log(userLocationData);
    const { data } = await axios.get(
      `${BASE_URL}/main?lat=${userLocationData.userLat}&lng=${userLocationData.userLong}`
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
export const fetchArcadeGlobal = createAsyncThunk(
  "games/fetchArcadeGlobal",
  async () => {
    try {
      const userLocationData = await phoneLocation();
      console.log(userLocationData);
      const { data } = await axios.get(`${BASE_URL}/arcades`);
      console.log(data, "ini data semua");
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const fetchBrand = createAsyncThunk("games/fetchBrand", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/brands`);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const gameSlice = createSlice({
  name: "games",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGame.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
  },
});

const arcadeDetailSlice = createSlice({
  name: "arcadesDetail",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArcadeDetail.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
  },
});

const arcadeSlice = createSlice({
  name: "arcades",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArcade.fulfilled, (state, action) => {
        return [...state, action.payload];
      })
      .addCase(fetchArcadeGlobal.fulfilled, (state, action) => {
        return [...state, action.payload];
      });
  },
});

const brandSlice = createSlice({
  name: "brands",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBrand.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
  },
});

const gameReducer = gameSlice.reducer;
const arcadeReducer = arcadeSlice.reducer;
const brandReducer = brandSlice.reducer;
const arcadeDetailReducer = arcadeDetailSlice.reducer;

export { gameReducer, arcadeReducer, brandReducer, arcadeDetailReducer };
export default {
  gameReducer,
  arcadeReducer,
  brandReducer,
  arcadeDetailReducer,
};
