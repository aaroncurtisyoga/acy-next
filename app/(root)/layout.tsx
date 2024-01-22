import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex flex-col h-dvh"}>
      <Header />
      <main className={"w-full max-w-screen-2xl lg:mx-auto"}>{children}</main>
      <Footer />
    </div>
  );
}
