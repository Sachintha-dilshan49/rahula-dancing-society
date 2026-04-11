"use client";

import Container from "@/shared/ui/Container";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--rahula-blue)] text-white pt-14 pb-12">
      <Container>
        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT - ABOUT */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[var(--rahula-gold)]">
              Rahula College Dancing Society
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              Preserving Sri Lankan dance traditions while inspiring
              excellence and cultural pride among students since 2000.
            </p>
          </div>

          {/* CENTER - LINKS */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Achievements", "Gallery", "Events", "About", "Contact"].map(
                (item, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-gray-200 hover:text-[var(--rahula-gold)] transition"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* RIGHT - CONTACT */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>

            <div className="space-y-3 text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--rahula-gold)]" />
                <span>Rahula College, Matara, Sri Lanka</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--rahula-gold)]" />
                <span>+94 41 222 2345</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--rahula-gold)]" />
                <span>dance@rahulacollege.lk</span>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex gap-4 pt-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[var(--rahula-gold)] hover:text-[var(--rahula-blue)] transition cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-300">
          © 2026 Rahula College Dancing Society. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}