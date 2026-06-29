"use client";

import Container from "@/shared/ui/Container";
import { Trophy, Users, Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}+</span>;
}

interface StatsData {
  students: number;
  achievements: number;
  performances: number;
  yearsOfExcellence: number;
}

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const stats = [
    { icon: Trophy, value: data?.achievements ?? 0, label: "Awards Won" },
    { icon: Users, value: data?.students ?? 0, label: "Active Members" },
    { icon: Calendar, value: data?.yearsOfExcellence ?? 0, label: "Years of Excellence" },
    { icon: Award, value: data?.performances ?? 0, label: "Performances" },
  ];

  return (
    <section className="bg-gray-100 py-16">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-sm
                hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <Icon className="text-[var(--rahula-blue)] w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-[var(--rahula-dark)] mb-2">
                  <Counter target={stat.value} />
                </h3>

                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
