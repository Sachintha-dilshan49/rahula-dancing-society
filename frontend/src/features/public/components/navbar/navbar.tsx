"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Achievements", href: "/achievements" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full px-4 md:px-6 lg:px-12">
        <div className="flex items-center justify-between py-4">

          {/* LEFT - Logo + Name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <Image
                src="/images/logo/logo.jpg"
                alt="Rahula College Dancing Society"
                fill
                className="object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="font-semibold text-[var(--rahula-dark)] text-sm md:text-lg leading-tight truncate">
                Rahula College
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 leading-none">
                Dancing Society
              </p>
            </div>
          </Link>

          {/* CENTER NAV - Desktop */}
          <nav className="hidden md:flex gap-6 lg:gap-8 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative transition duration-200 py-2 ${
                  pathname === link.href
                    ? "text-[var(--rahula-blue)]"
                    : "text-gray-700 hover:text-[var(--rahula-blue)]"
                }`}
              >
                {link.name}

                {pathname === link.href && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[var(--rahula-gold)]"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT - Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium border border-[var(--rahula-gold)] text-[var(--rahula-dark)] hover:bg-[var(--rahula-gold)] hover:text-white transition duration-300 whitespace-nowrap"
            >
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} className="text-[var(--rahula-blue)]" /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top duration-300 pb-4 shadow-lg">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-50 text-[var(--rahula-blue)]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2 sm:hidden" />
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="sm:hidden px-4 py-3 rounded-lg text-base font-medium text-[var(--rahula-blue)] hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}