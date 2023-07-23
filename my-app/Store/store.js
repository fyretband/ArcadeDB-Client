import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import reducers, { fetchGame, fetchArcade } from "../Reducer/game";
const store = configureStore({
  reducer: {
    games: reducers.gameReducer,
    arcades: reducers.arcadeReducer,
    brands: reducers.brandReducer,
    arcadesDetail: reducers.arcadeDetailReducer,
  },
  middleware: [thunk],
});

export default store;
