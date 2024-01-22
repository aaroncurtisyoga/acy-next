import AdminLinks from "@/components/shared/AdminLinks";
import UserLinks from "@/components/shared/UserLinks";

export default function NavItems() {
  return (
    <ul className="flex w-full flex-col items-start gap-5 max-sm:mt-4 md:flex-row md:justify-end">
      <AdminLinks />
      <UserLinks />
    </ul>
  );
}
