"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-white overflow-hidden">

      {/* Background Image */}
      <Image
        src="/images/hero/new-hero-bg.jpg"
        alt="Rahula College Dancing Society"
        fill
        priority
        className="object-cover object-center blur-[2px] scale-105"
      />

      {/* Blue Overlay */}
      <div className="absolute inset-0 bg-[var(--rahula-blue)]/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        
        <h1 className="font-bold leading-tight">
          <span className="block text-4xl md:text-6xl">
            Rahula College
          </span>
          <span className="block text-5xl md:text-7xl text-[var(--rahula-gold)]">
            Dancing Society
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200">
          Preserving tradition. Inspiring excellence.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">

          <Link
            href="#about"
            className="px-6 py-3 bg-[var(--rahula-gold)] text-[var(--rahula-dark)] font-semibold rounded-lg hover:scale-105 transition duration-300"
          >
            Explore More
          </Link>

          <Link
            href="/gallery"
            className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-[var(--rahula-dark)] transition duration-300"
          >
            View Gallery →
          </Link>

        </div>
      </div>

    </section>
  );
}