"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Achievements", href: "/achievements" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between py-4">

          {/* LEFT - Logo + Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo/logo.jpg"
                alt="Rahula College Dancing Society"
                fill
                className="object-contain"
              />
            </div>

            <div>
              <h1 className="font-semibold text-[var(--rahula-dark)] leading-none">
                Rahula College
              </h1>
              <p className="text-sm text-gray-500 leading-none">
                Dancing Society
              </p>
            </div>
          </Link>

          {/* CENTER NAV */}
          <nav className="hidden md:flex gap-10 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative transition duration-200 ${
                  pathname === link.href
                    ? "text-[var(--rahula-blue)]"
                    : "text-gray-700 hover:text-[var(--rahula-blue)]"
                }`}
              >
                {link.name}

                {pathname === link.href && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[var(--rahula-gold)]"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT - Login */}
          <Link
            href="/login"
            className="px-6 py-2 rounded-lg font-medium border border-[var(--rahula-gold)] text-[var(--rahula-dark)] hover:bg-[var(--rahula-gold)] hover:text-white transition duration-300"
          >
            Login
          </Link>

        </div>
      </div>
    </header>
  );
}