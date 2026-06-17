"use client";

import Image from "next/image";
import Container from "@/shared/ui/Container";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section className="py-16 bg-gray-100">
      <Container>
        <div className="
          bg-white 
          rounded-2xl 
          shadow-sm 
          hover:shadow-md 
          transition 
          duration-300 
          p-8 md:p-14
        ">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            
            {/* LEFT CONTENT */}
            <div className="space-y-5">
              
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--rahula-dark)] leading-snug">
                About Rahula College Dancing Society
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Founded in 2000, the Rahula College Dancing Society has grown
                into one of Sri Lanka’s respected school-level dance
                organizations. We preserve Kandyan and Pahatharata traditions
                while embracing modern artistic expression.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Through discipline, teamwork, and dedication, our students
                build confidence and cultural pride while representing
                Rahula College at provincial and national events.
              </p>

              <button className="
                inline-flex 
                items-center 
                gap-2 
                text-[var(--rahula-blue)] 
                font-medium 
                hover:gap-3 
                transition-all 
                duration-300
              ">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative group">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/images/about/dance.jpg"
                  alt="Rahula Dance"
                  fill
                  className="
                    object-cover 
                    group-hover:scale-105 
                    transition-transform 
                    duration-500
                  "
                />
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}