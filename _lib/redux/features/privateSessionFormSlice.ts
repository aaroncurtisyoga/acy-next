import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/_lib/redux/createAppSlice";
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";

export interface PrivateSessionFormSliceState {
  selectedPackage: OfferingType;
}

const initialState: PrivateSessionFormSliceState = {
  selectedPackage: null,
};

export const privateSessionFormSlice = createAppSlice({
  name: "PrivateSessionFormSliceState",
  initialState,
  reducers: (create) => ({
    setSelectedPackage: create.reducer(
      (state, action: PayloadAction<Partial<typeof OfferingType>>) => {
        const payload = action.payload;
        state.selectedPackage = { ...state.selectedPackage, ...payload };
      },
    ),
  }),
  selectors: {
    selectPackage: (state) => state.selectedPackage,
  },
});

export const { setSelectedPackage } = privateSessionFormSlice.actions;

export const { selectPackage } = privateSessionFormSlice.selectors;
