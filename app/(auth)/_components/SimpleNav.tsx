import Logo from "@/app/_components/Header/Logo";

const SimpleNav = () => {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav className="mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-12 py-4">
        <Logo />
      </nav>
    </header>
  );
};

export default SimpleNav;
