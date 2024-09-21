import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/_lib/redux/createAppSlice";
import { findOfferingByPackage } from "@/app/(root)/private-sessions/_lib/helpers";
import { ALL_OFFERINGS } from "@/app/(root)/private-sessions/_lib/constants";
import { selectPackageFormDefaultValues } from "@/_lib/constants";
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";

export interface PrivateSessionFormSliceState {
  selectedPackage: OfferingType;
}

const initialState: PrivateSessionFormSliceState = {
  selectedPackage: selectPackageFormDefaultValues,
};

export const privateSessionFormSlice = createAppSlice({
  name: "PrivateSessionFormSliceState",
  initialState,
  reducers: (create) => ({
    setSelectedPackage: create.reducer(
      (state, action: PayloadAction<string>) => {
        const selectedPackageName = action.payload;
        const foundOffering = findOfferingByPackage(
          selectedPackageName,
          ALL_OFFERINGS,
        );
        if (foundOffering) {
          state.selectedPackage = foundOffering;
        }
      },
    ),
  }),
  selectors: {
    selectedPackage: (state) => state.selectedPackage,
  },
});

export const { setSelectedPackage } = privateSessionFormSlice.actions;

export const { selectedPackage } = privateSessionFormSlice.selectors;
