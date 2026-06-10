"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/salaris-calculator", label: "Salaris" },
    { href: "/ort-calculator", label: "ORT" },
    { href: "/vakantiegeld-berekenen", label: "Vakantiegeld" },
    { href: "/eindejaarsuitkering-berekenen", label: "Eindejaar" },
    { href: "/cao-vvt", label: "CAO VVT" },
    { href: "/vacatures", label: "Vacatures" },
    { href: "/nieuws", label: "Nieuws" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[70px] md:h-[85px] lg:h-24 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/zorgwerkwijzer-logo.png"
                alt="Zorgwerkwijzer"
                width={240}
                height={90}
                className="h-[60px] md:h-[75px] lg:h-[90px] w-auto object-contain"
                priority
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-10 lg:gap-12 shrink-0">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-slate-600 hover:text-brand-blue font-medium transition-all duration-300 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-brand-blue transition-colors"
              aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-slate-600 hover:text-brand-blue font-bold text-lg py-2 border-b border-slate-50 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
