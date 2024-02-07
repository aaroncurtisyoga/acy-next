import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      <main className={"grow grid w-full"}>{children}</main>
      <Footer />
    </div>
  );
}
