import { NavbarMenuItem } from "@nextui-org/react";

const CustomMenuItem = ({ children, ...props }) => {
  return (
    <NavbarMenuItem
      className="py-3 px-4 w-full text-right border-b border-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    >
      {children}
    </NavbarMenuItem>
  );
};

export default CustomMenuItem;
