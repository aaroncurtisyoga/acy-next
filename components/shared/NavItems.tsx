import AdminLinks from "@/components/shared/AdminLinks";
import AuthenticatedLinks from "@/components/shared/AuthenticatedLinks";
import EndUserLinks from "@/components/shared/EndUserLinks";

export default function NavItems() {
  return (
    <ul>
      <AdminLinks />
      <AuthenticatedLinks />
      <EndUserLinks />
    </ul>
  );
}
