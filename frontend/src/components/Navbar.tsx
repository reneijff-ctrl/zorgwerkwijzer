'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, User, FileText, Bookmark, LogOut, ChevronDown, LogIn,
  LayoutDashboard, Briefcase, Building2, ClipboardList,
  Calculator, BookOpen, Stethoscope, Heart, Users, UserPlus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ─── Dropdown-configuratie ────────────────────────────────────────────────────

const calculatorLinks = [
  { href: '/salaris-calculator', label: 'Salaris calculator' },
  { href: '/ort-calculator', label: 'ORT calculator' },
  { href: '/vakantiegeld-berekenen', label: 'Vakantiegeld' },
  { href: '/eindejaarsuitkering-berekenen', label: 'Eindejaarsuitkering' },
];

const vacatureLinks = [
  { href: '/vacatures', label: 'Alle vacatures', bold: true },
  { href: '/vacatures/verpleegkundige', label: 'Verpleegkundige', icon: Stethoscope },
  { href: '/vacatures/verzorgende-ig', label: 'Verzorgende IG', icon: Heart },
  { href: '/vacatures/helpende-plus', label: 'Helpende Plus', icon: Users },
];

const caoLinks = [
  { href: '/cao', label: 'Alle CAO\'s', bold: true },
  { href: '/cao-vvt', label: 'CAO VVT' },
  { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
  { href: '/cao/ggz', label: 'CAO GGZ' },
  { href: '/cao/gehandicaptenzorg', label: 'CAO Gehandicaptenzorg' },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Schaduw bij scrollen
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 4);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sluit menus bij klik buiten
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      const clickedInsideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(e.target as Node),
      );
      if (!clickedInsideDropdown) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sluit alle menus bij route-change
  useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/');
  }

  function getInitials(email: string): string {
    return email.slice(0, 2).toUpperCase();
  }

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <nav
      className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-200 ${
        isScrolled
          ? 'shadow-md border-b border-slate-200'
          : 'border-b border-slate-100'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* 3-koloms layout: Logo | Nav | Auth */}
        <div className="flex items-center h-16 lg:h-[72px] gap-6">

          {/* ── LINKS: Logo ─────────────────────────────────────────────── */}
          <div className="flex items-center shrink-0 mr-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/zorgwerkwijzer-logo.png"
                alt="Zorgwerkwijzer"
                width={200}
                height={56}
                className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* ── MIDDEN: Desktop navigatie ────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">

            {/* Calculators dropdown */}
            <div
              className="relative"
              ref={(el) => { dropdownRefs.current['calc'] = el; }}
            >
              <button
                onClick={() => toggleDropdown('calc')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                  openDropdown === 'calc'
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
                aria-expanded={openDropdown === 'calc'}
              >
                <Calculator className="w-4 h-4" />
                Calculators
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'calc' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'calc' && (
                <DropdownPanel>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Calculators</p>
                  {calculatorLinks.map((l) => (
                    <DropdownLink key={l.href} href={l.href} onClick={() => setOpenDropdown(null)}>
                      <Calculator className="w-4 h-4 text-slate-400 shrink-0" />
                      {l.label}
                    </DropdownLink>
                  ))}
                </DropdownPanel>
              )}
            </div>

            {/* Vacatures dropdown */}
            <div
              className="relative"
              ref={(el) => { dropdownRefs.current['vac'] = el; }}
            >
              <button
                onClick={() => toggleDropdown('vac')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                  openDropdown === 'vac'
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
                aria-expanded={openDropdown === 'vac'}
              >
                <Briefcase className="w-4 h-4" />
                Vacatures
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'vac' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'vac' && (
                <DropdownPanel>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vacatures</p>
                  {vacatureLinks.map((l, i) => {
                    const Icon = 'icon' in l ? l.icon : null;
                    return (
                      <div key={l.href}>
                        {i === 1 && <div className="border-t border-slate-100 my-1 mx-3" />}
                        <DropdownLink href={l.href} onClick={() => setOpenDropdown(null)} bold={l.bold}>
                          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
                          {!Icon && <Briefcase className="w-4 h-4 text-sky-500 shrink-0" />}
                          {l.label}
                        </DropdownLink>
                      </div>
                    );
                  })}
                </DropdownPanel>
              )}
            </div>

            {/* CAO's dropdown */}
            <div
              className="relative"
              ref={(el) => { dropdownRefs.current['cao'] = el; }}
            >
              <button
                onClick={() => toggleDropdown('cao')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                  openDropdown === 'cao'
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
                aria-expanded={openDropdown === 'cao'}
              >
                <BookOpen className="w-4 h-4" />
                CAO&apos;s
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'cao' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'cao' && (
                <DropdownPanel>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">CAO&apos;s</p>
                  {caoLinks.map((l, i) => (
                    <div key={l.href}>
                      {i === 1 && <div className="border-t border-slate-100 my-1 mx-3" />}
                      <DropdownLink href={l.href} onClick={() => setOpenDropdown(null)} bold={l.bold}>
                        <BookOpen className={`w-4 h-4 shrink-0 ${l.bold ? 'text-sky-500' : 'text-slate-400'}`} />
                        {l.label}
                      </DropdownLink>
                    </div>
                  ))}
                </DropdownPanel>
              )}
            </div>

            {/* Werkgevers link */}
            <Link
              href="/werkgevers"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50 whitespace-nowrap"
            >
              <Building2 className="w-4 h-4" />
              Werkgevers
            </Link>

            {/* Nieuws link */}
            <Link
              href="/nieuws"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50 whitespace-nowrap"
            >
              Nieuws
            </Link>
          </div>

          {/* ── RECHTS: Auth-sectie ──────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 ml-auto">
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Gebruikersmenu"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {getInitials(user.email)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[110px] truncate hidden xl:block">
                    {user.email}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden py-1">
                    <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    {user.role === 'ROLE_EMPLOYER' ? (
                      <>
                        <UserMenuItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Werkgeversdashboard
                        </UserMenuItem>
                        <UserMenuItem href="/dashboard/bedrijf" icon={<Building2 className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Bedrijfsprofiel
                        </UserMenuItem>
                        <UserMenuItem href="/dashboard/vacatures" icon={<Briefcase className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Vacatures
                        </UserMenuItem>
                        <UserMenuItem href="/dashboard/sollicitaties" icon={<ClipboardList className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Sollicitaties
                        </UserMenuItem>
                      </>
                    ) : (
                      <>
                        <UserMenuItem href="/profiel" icon={<User className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Mijn Profiel
                        </UserMenuItem>
                        <UserMenuItem href="/mijn-sollicitaties" icon={<FileText className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Mijn Sollicitaties
                        </UserMenuItem>
                        <UserMenuItem href="/mijn-vacatures" icon={<Bookmark className="w-4 h-4" />} onClick={() => setIsUserMenuOpen(false)}>
                          Opgeslagen Vacatures
                        </UserMenuItem>
                      </>
                    )}
                    <div className="border-t border-slate-100 mt-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Voor Werkgevers — primaire CTA */}
                <Link
                  href="/werkgever"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200 whitespace-nowrap"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Voor Werkgevers
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors rounded-xl hover:bg-slate-50 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Inloggen
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Registreren
                </Link>
              </>
            )}
          </div>

          {/* ── Tablet nav (md–lg) ──────────────────────────────────────── */}
          <div className="hidden md:flex lg:hidden items-center gap-1 flex-1 justify-center">
            <NavPill href="/vacatures" active={pathname.startsWith('/vacatures')}>Vacatures</NavPill>
            <NavPill href="/salaris-calculator" active={pathname.includes('calculator')}>Calculators</NavPill>
            <NavPill href="/cao" active={pathname.startsWith('/cao')}>CAO&apos;s</NavPill>
            <NavPill href="/werkgevers" active={pathname.startsWith('/werkgevers')}>Werkgevers</NavPill>
          </div>
          <div className="hidden md:flex lg:hidden items-center gap-2 shrink-0">
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/login" className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
                  Inloggen
                </Link>
                <Link href="/register" className="px-3.5 py-1.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm">
                  Registreren
                </Link>
              </>
            )}
            {!isLoading && isAuthenticated && user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

          {/* ── Mobiel hamburger ────────────────────────────────────────── */}
          <div className="flex md:hidden items-center ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50"
              aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobiel menu ─────────────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-3 px-4">
          <div className="flex flex-col gap-0.5">

            {/* Auth-knoppen bovenaan (uitgelogd) */}
            {!isLoading && !isAuthenticated && (
              <div className="flex flex-col gap-2 pb-4 mb-2 border-b border-slate-100">
                <Link
                  href="/werkgever"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 border border-sky-200 bg-sky-50 rounded-2xl text-sky-700 font-semibold text-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  Voor Werkgevers
                </Link>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-2xl text-slate-700 font-semibold text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Inloggen
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 rounded-2xl text-white font-bold text-sm"
                  >
                    Registreren
                  </Link>
                </div>
              </div>
            )}

            {/* Auth-info bovenaan (ingelogd) */}
            {!isLoading && isAuthenticated && user && (
              <div className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {getInitials(user.email)}
                </div>
                <span className="text-sm font-medium text-slate-700 truncate">{user.email}</span>
              </div>
            )}

            {/* Navigatielinks */}
            <MobileSection label="Calculators" icon={<Calculator className="w-5 h-5 text-slate-400" />}>
              {calculatorLinks.map((l) => (
                <MobileSubLink key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)}>
                  {l.label}
                </MobileSubLink>
              ))}
            </MobileSection>

            <MobileSection label="Vacatures" icon={<Briefcase className="w-5 h-5 text-slate-400" />}>
              <MobileSubLink href="/vacatures" onClick={() => setIsMenuOpen(false)} bold>
                Alle vacatures
              </MobileSubLink>
              {vacatureLinks.filter(l => !l.bold).map((l) => {
                const Icon = 'icon' in l ? l.icon : null;
                return (
                  <MobileSubLink key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)}>
                    {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
                    {l.label}
                  </MobileSubLink>
                );
              })}
            </MobileSection>

            <MobileSection label="CAO's" icon={<BookOpen className="w-5 h-5 text-slate-400" />}>
              {caoLinks.map((l) => (
                <MobileSubLink key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)} bold={l.bold}>
                  {l.label}
                </MobileSubLink>
              ))}
            </MobileSection>

            <Link
              href="/werkgevers"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-2 text-slate-700 font-semibold text-base border-b border-slate-50"
            >
              <Building2 className="w-5 h-5 text-slate-400" />
              Werkgevers
            </Link>
            <Link
              href="/nieuws"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-2 text-slate-700 font-semibold text-base border-b border-slate-50"
            >
              Nieuws
            </Link>

            {/* Ingelogd gebruikersmenu */}
            {!isLoading && isAuthenticated && user && (
              <div className="border-t border-slate-100 pt-3 mt-2">
                {user.role === 'ROLE_EMPLOYER' ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <LayoutDashboard className="w-5 h-5 text-slate-400" />
                      Werkgeversdashboard
                    </Link>
                    <Link href="/dashboard/bedrijf" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <Building2 className="w-5 h-5 text-slate-400" />
                      Bedrijfsprofiel
                    </Link>
                    <Link href="/dashboard/vacatures" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      Vacatures
                    </Link>
                    <Link href="/dashboard/sollicitaties" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <ClipboardList className="w-5 h-5 text-slate-400" />
                      Sollicitaties
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profiel" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <User className="w-5 h-5 text-slate-400" />
                      Mijn Profiel
                    </Link>
                    <Link href="/mijn-sollicitaties" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <FileText className="w-5 h-5 text-slate-400" />
                      Mijn Sollicitaties
                    </Link>
                    <Link href="/mijn-vacatures" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2.5 text-slate-700 font-medium">
                      <Bookmark className="w-5 h-5 text-slate-400" />
                      Opgeslagen Vacatures
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2.5 text-red-600 font-medium w-full mt-1"
                >
                  <LogOut className="w-5 h-5" />
                  Uitloggen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Helper componenten ───────────────────────────────────────────────────────

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-full mt-1.5 min-w-[220px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden pb-2 z-50">
      {children}
    </div>
  );
}

function DropdownLink({
  href,
  onClick,
  children,
  bold,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
        bold ? 'font-semibold text-slate-900' : 'text-slate-700'
      }`}
    >
      {children}
    </Link>
  );
}

function UserMenuItem({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      {children}
    </Link>
  );
}

function NavPill({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        active ? 'text-sky-600 bg-sky-50' : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileSection({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-50">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-3 px-2 text-slate-700 font-semibold text-base"
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-8 pb-2 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileSubLink({
  href,
  onClick,
  children,
  bold,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 py-2 text-sm transition-colors ${
        bold ? 'font-semibold text-slate-800' : 'text-slate-600 hover:text-sky-600'
      }`}
    >
      {children}
    </Link>
  );
}
