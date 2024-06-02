import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/_lib/redux/createAppSlice";
import { eventFormDefaultValues } from "@/_lib/constants";
import { isDate } from "@/_lib/utils";

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
        const payload = action.payload;
        // Redux doesn't allow date objects to be stored in the store
        if (isDate(payload.createdAt)) {
          payload.createdAt = payload.createdAt.toISOString();
        }
        if (isDate(payload.startDateTime)) {
          payload.startDateTime = payload.startDateTime.toISOString();
        }
        if (isDate(payload.endDateTime)) {
          payload.endDateTime = payload.endDateTime.toISOString();
        }

        state.formValues = { ...state.formValues, ...payload };
      },
    ),
    resetFormData: create.reducer((state) => {
      state.formValues = eventFormDefaultValues;
      state.eventType = "Create";
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
