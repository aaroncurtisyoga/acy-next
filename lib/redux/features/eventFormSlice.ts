import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/lib/redux/createAppSlice";
import { eventFormDefaultValues } from "@/constants";

export interface EventFormSliceState {
  formValues: typeof eventFormDefaultValues;
  eventType: "Create" | "Update";
}

const initialState: EventFormSliceState = {
  formValues: eventFormDefaultValues,
  eventType: "Create",
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
    setEventType: create.reducer(
      (state, action: PayloadAction<"Create" | "Update">) => {
        state.eventType = action.payload;
      },
    ),
  }),
  selectors: {
    selectIsHostedExternally: (state) => state.formValues.isHostedExternally,
    selectFormValues: (state) => state.formValues,
    selectEventType: (state) => state.eventType,
  },
});

export const { setFormData, resetFormData } = createEventFormSlice.actions;

export const { selectIsHostedExternally, selectFormValues, selectEventType } =
  createEventFormSlice.selectors;
