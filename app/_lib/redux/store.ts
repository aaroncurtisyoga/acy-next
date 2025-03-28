import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { createEventFormSlice } from "@/app/_lib/redux/features/eventFormSlice";
import { privateSessionFormSlice } from "@/app/_lib/redux/features/privateSessionFormSlice";
import type { Action, ThunkAction } from "@reduxjs/toolkit";

const rootReducer = combineSlices(
  createEventFormSlice,
  privateSessionFormSlice,
);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
