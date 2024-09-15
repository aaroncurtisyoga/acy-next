import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/_lib/redux/createAppSlice";
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";
import { findOfferingByPackage } from "@/app/(root)/private-sessions/_lib/helpers";
import { ALL_OFFERINGS } from "@/app/(root)/private-sessions/_lib/constants";

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
      (state, action: PayloadAction<string>) => {
        const selectedPackageName = action.payload;
        state.selectedPackage = findOfferingByPackage(
          selectedPackageName,
          ALL_OFFERINGS,
        );
      },
    ),
  }),
  selectors: {
    selectedPackage: (state) => state.selectedPackage,
  },
});

export const { setSelectedPackage } = privateSessionFormSlice.actions;

export const { selectedPackage } = privateSessionFormSlice.selectors;
