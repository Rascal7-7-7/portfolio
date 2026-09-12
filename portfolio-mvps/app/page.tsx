import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MVPGrid } from "@/components/MVPGrid";
import { Why } from "@/components/Why";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-700 focus:text-white"
      >
        メインコンテンツへスキップ
      </a>
      <Header />
      <main id="main" className="min-h-screen bg-surface-950">
        <Hero />
        <MVPGrid />
        <Why />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
