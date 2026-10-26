import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Flow } from "@/components/Flow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Profile } from "@/components/Profile";
import { Steps } from "@/components/Steps";
import { Works } from "@/components/Works";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Works />
        <Flow />
        <Steps />
        <Pricing />
        <Profile />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
