// Function to find an offering by package name
import { OfferingType } from "@/app/(root)/private-sessions/_lib/types";

export function findOfferingByPackage(
  packageName: string,
  allOfferings: OfferingType[],
): OfferingType | undefined {
  return allOfferings.find((offering) => offering.package === packageName);
}
