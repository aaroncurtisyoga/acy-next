import HeroImage from "../hero-image/hero-image";

export default function Layout({ children }) {
  return (
    <main>
      <HeroImage />
      {children}
    </main>
  );
}
