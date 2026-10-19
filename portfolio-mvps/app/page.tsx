import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MVPGrid } from "@/components/MVPGrid";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <MVPGrid />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
