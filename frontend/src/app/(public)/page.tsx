import Hero from "@/features/public/components/hero/Hero";
import Stats from "@/features/public/components/stats/Stats";
import About from "@/features/public/components/about/About";
import Traditions from "@/features/public/components/traditions/Traditions";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Traditions />
    </>
  );
}