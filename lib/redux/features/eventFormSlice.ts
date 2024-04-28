import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/lib/redux/createAppSlice";
import { eventFormDefaultValues } from "@/constants";
import { PlaceDetails } from "@/types";

export interface EventFormSliceState {
  formValues: typeof eventFormDefaultValues;
}

const initialState: EventFormSliceState = {
  formValues: eventFormDefaultValues,
};

export const createEventFormSlice = createAppSlice({
  name: "EventFormSliceState",
  initialState,
  reducers: (create) => ({
    setFormData: create.reducer(
      (
        state,
        action: PayloadAction<Partial<typeof eventFormDefaultValues>>,
      ) => {
        state.formValues = { ...state.formValues, ...action.payload };
      },
    ),
    resetFormData: create.reducer((state) => {
      state.formValues = eventFormDefaultValues;
    }),
  }),
  selectors: {
    selectIsHostedExternally: (state) => state.formValues.isHostedExternally,
    selectFormValues: (state) => state.formValues,
  },
});

export const { setFormData, resetFormData } = createEventFormSlice.actions;

export const { selectIsHostedExternally, selectFormValues } =
  createEventFormSlice.selectors;
