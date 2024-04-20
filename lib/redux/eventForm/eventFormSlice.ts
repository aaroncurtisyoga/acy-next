import { createAppSlice } from "@/lib/redux/createAppSlice";
import { AppThunk } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

export interface EventFormSliceState {}

const initialState: EventFormSliceState = {};

export const createEventFormSlice = createAppSlice({
  name: "EventFormSliceState",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setFormData } = createEventFormSlice.actions;
