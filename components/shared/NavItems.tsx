import AdminLinks from "@/components/shared/AdminLinks";
import AuthenticatedLinks from "@/components/shared/AuthenticatedLinks";
import EndUserLinks from "@/components/shared/EndUserLinks";

export default function NavItems() {
  return (
    <ul className="flex w-full flex-col items-start gap-5 max-sm:mt-4 md:flex-row md:justify-end">
      <AdminLinks />
      <AuthenticatedLinks />
    </ul>
  );
}
