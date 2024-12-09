import { NavbarMenuItem } from "@nextui-org/react";

const CustomMenuItem = ({ children, ...props }) => {
  return (
    <NavbarMenuItem
      className="w-full px-2 max-w-screen-2xl lg:mx-auto py-3 text-right rounded-sm border-b
      border-gray-400 hover:bg-primary/10 focus:bg-primary/20 focus:outline-none
      focus:ring-2 focus:ring-primary"
      {...props}
    >
      {children}
    </NavbarMenuItem>
  );
};

export default CustomMenuItem;
