// import AdminLinks from "@/components/shared/nav/AdminLinks";
import UserLinks from "@/components/shared/nav/UserLinks";

const NavItems = () => {
  return (
    <ul className="flex w-full flex-col items-start gap-5 max-sm:mt-4 md:flex-row md:justify-end">
      {/*<AdminLinks />*/}
      <UserLinks />
    </ul>
  );
};

export default NavItems;
