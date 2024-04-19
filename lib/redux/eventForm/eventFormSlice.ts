import { createAppSlice } from "@/lib/redux/createAppSlice";
import { AppThunk } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

export interface EventFormSliceState {}

const initialState: EventFormSliceState = {};

export const eventFormStepOneSlice = createAppSlice({
  name: "EventFormSliceState",
  initialState,
  reducers: {},
});
