import { PayloadAction } from "@reduxjs/toolkit";
import { PackageDetailsType } from "@/app/(root)/private-sessions/_lib/types";
import { selectedPackageDetailsDefaultValues } from "@/app/_lib/constants";
import { createAppSlice } from "@/app/_lib/redux/createAppSlice";

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
