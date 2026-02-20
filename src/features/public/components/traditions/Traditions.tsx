"use client";

import Container from "@/shared/ui/Container";
import { Theater, Sparkles, Waves, ArrowRight } from "lucide-react";

export default function Traditions() {
  const traditions = [
    {
      icon: Theater,
      title: "Kandyan Dance",
      desc: "The classical dance of the Kandyan Kingdom characterized by vibrant costumes and intricate footwork.",
    },
    {
      icon: Waves,
      title: "Pahatharata",
      desc: "Low-country dance traditions featuring unique rhythms and coastal cultural elements.",
    },
    {
      icon: Sparkles,
      title: "Contemporary",
      desc: "Modern interpretations blending traditional elements with innovative choreography.",
    },
  ];

  return (
    <section className="pt-14 pb-20 bg-gray-100">
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
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--rahula-dark)]">
              Our Dance Traditions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mastering three distinct dance forms that represent the rich cultural tapestry of Sri Lanka.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {traditions.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    group
                    border
                    rounded-xl
                    p-8
                    transition-all
                    duration-300
                    hover:shadow-lg
                    hover:-translate-y-2
                    hover:border-[var(--rahula-blue)]
                  "
                >
                  <div className="
                    w-12 h-12
                    flex items-center justify-center
                    rounded-lg
                    bg-gray-100
                    group-hover:bg-[var(--rahula-blue)]
                    transition
                    duration-300
                    mb-5
                  ">
                    <Icon className="
                      w-6 h-6
                      text-[var(--rahula-blue)]
                      group-hover:text-white
                      transition
                    " />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {item.desc}
                  </p>

                  <div className="
                    flex items-center gap-2
                    text-[var(--rahula-blue)]
                    text-sm
                    font-medium
                    opacity-0
                    group-hover:opacity-100
                    transition
                  ">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}