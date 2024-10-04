import { PayloadAction } from "@reduxjs/toolkit";
import { selectedPackageDetailsDefaultValues } from "@/_lib/constants";
import { createAppSlice } from "@/_lib/redux/createAppSlice";
import { PackageDetailsType } from "@/app/(root)/private-sessions/_lib/types";

export interface PrivateSessionFormSliceState {
  package: string;
  packageDetails: PackageDetailsType;
}

const initialState: PrivateSessionFormSliceState = {
  package: "",
  packageDetails: selectedPackageDetailsDefaultValues,
};

export const privateSessionFormSlice = createAppSlice({
  name: "PrivateSessionFormSliceState",
  initialState,
  reducers: (create) => ({
    setSelectedPackage: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.package = action.payload;
      },
    ),
  }),
  selectors: {
    selectedPackage: (state) => state.package,
  },
});

export const { setSelectedPackage } = privateSessionFormSlice.actions;

export const { selectedPackage } = privateSessionFormSlice.selectors;
