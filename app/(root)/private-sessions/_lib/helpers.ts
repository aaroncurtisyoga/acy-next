import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";

// Function to find an offering by package name
export function findOfferingByPackage(
  packageName: string,
  allOfferings: OfferingType[],
): OfferingType | undefined {
  return allOfferings.find((offering) => offering.package === packageName);
}
