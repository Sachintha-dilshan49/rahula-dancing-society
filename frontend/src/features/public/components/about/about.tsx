"use client";

import Image from "next/image";
import Container from "@/shared/ui/Container";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section className="py-20 bg-gray-100">
      <Container>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 p-8 md:p-14">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT IMAGE */}
            <div className="relative group">
              <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/about/dance.jpg"
                  alt="Rahula College Dancing Society"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* RIGHT TEXT */}
            <div className="space-y-6">

              {/* TITLE */}
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--rahula-blue)]">
                About the Society
              </h2>

              <p className="text-gray-600 leading-relaxed">
                The Rahula College Dancing Society has been a cornerstone
                of cultural preservation and artistic excellence in Matara
                since 2001. Our mission is to nurture young talent while
                honoring the rich traditions of Sri Lankan classical dance.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Through dedicated training and performances, our students
                master the intricate techniques of Kandyan, Low Country,
                and Sabaragamuwa dance forms, carrying forward a legacy
                that spans generations.
              </p>

              <p className="text-gray-600 leading-relaxed">
                We take pride in our numerous accolades and seeing our
                students develop confidence, discipline, and a deep
                appreciation for their cultural heritage.
              </p>

              {/* BUTTON */}
              <button
                className="
                  inline-flex
                  items-center
                  gap-2
                  w-fit
                  bg-[var(--rahula-blue)]
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  font-medium
                  hover:bg-[var(--rahula-dark)]
                  transition
                  duration-300
                              "
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}