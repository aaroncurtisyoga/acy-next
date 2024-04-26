import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/lib/redux/createAppSlice";
import { eventFormDefaultValues } from "@/constants";
import { PlaceDetails } from "@/types";

export interface EventFormSliceState {
  formValues: typeof eventFormDefaultValues;
  placeSuggestions: PlaceDetails[];
}

const initialState: EventFormSliceState = {
  formValues: eventFormDefaultValues,
  placeSuggestions: [],
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
    setPlaceSuggestions: create.reducer(
      (state, action: PayloadAction<PlaceDetails[]>) => {
        state.placeSuggestions = action.payload;
      },
    ),
  }),
  selectors: {
    selectIsHostedExternally: (state) => state.formValues.isHostedExternally,
    selectFormValues: (state) => state.formValues,
    selectPlaceSuggestions: (state) => state.placeSuggestions,
  },
});

export const { setFormData, resetFormData, setPlaceSuggestions } =
  createEventFormSlice.actions;

export const {
  selectIsHostedExternally,
  selectFormValues,
  selectPlaceSuggestions,
} = createEventFormSlice.selectors;
