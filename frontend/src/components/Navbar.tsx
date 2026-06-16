'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, X, User, FileText, Bookmark, LogOut, ChevronDown, LogIn,
  LayoutDashboard, Briefcase, Building2, ClipboardList,
  Calculator, BookOpen, Stethoscope, UserPlus, TrendingUp, GraduationCap,
  PlusCircle, Newspaper, Settings,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ─── Navigatieconfiguratie ────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  bold?: boolean;
  icon?: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavDropdown {
  id: string;
  label: string;
  icon: React.ReactNode;
  groups: NavGroup[];
}

const navigation: NavDropdown[] = [
  {
    id: 'vacatures',
    label: 'Vacatures',
    icon: <Briefcase className="w-4 h-4" />,
    groups: [
      {
        label: 'Vacatures',
        items: [
          { href: '/vacatures', label: 'Alle vacatures', bold: true },
          { href: '/vacatures/verpleegkundige', label: 'Verpleegkundige vacatures' },
          { href: '/vacatures/verzorgende-ig', label: 'Verzorgende IG vacatures' },
          { href: '/vacatures/helpende-plus', label: 'Helpende Plus vacatures' },
        ],
      },
      {
        label: 'Werkgevers',
        items: [
          { href: '/werkgevers', label: 'Voor werkgevers', bold: true },
        ],
      },
    ],
  },
  {
    id: 'salaris-cao',
    label: 'Salaris & CAO',
    icon: <TrendingUp className="w-4 h-4" />,
    groups: [
      {
        label: 'Salarissen',
        items: [
          { href: '/salaris', label: 'Alle salarissen', bold: true },
          { href: '/salaris/verpleegkundige', label: 'Salaris verpleegkundige' },
          { href: '/salaris/verzorgende-ig', label: 'Salaris verzorgende IG' },
          { href: '/salaris/helpende-plus', label: 'Salaris helpende plus' },
          { href: '/salaris/doktersassistent', label: 'Salaris doktersassistent' },
        ],
      },
      {
        label: "CAO's",
        items: [
          { href: '/cao', label: "Alle CAO's", bold: true },
          { href: '/cao/vvt', label: 'CAO VVT' },
          { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
          { href: '/cao/ggz', label: 'CAO GGZ' },
        ],
      },
    ],
  },
  {
    id: 'beroepen',
    label: 'Beroepen',
    icon: <Stethoscope className="w-4 h-4" />,
    groups: [
      {
        label: 'Populaire beroepen',
        items: [
          { href: '/beroepen', label: 'Alle beroepen', bold: true },
          { href: '/beroepen/verpleegkundige', label: 'Verpleegkundige' },
          { href: '/beroepen/verzorgende-ig', label: 'Verzorgende IG' },
          { href: '/beroepen/helpende-plus', label: 'Helpende Plus' },
          { href: '/beroepen/doktersassistent', label: 'Doktersassistent' },
          { href: '/beroepen/wijkverpleegkundige', label: 'Wijkverpleegkundige' },
          { href: '/beroepen/gz-psycholoog', label: 'GZ-psycholoog' },
        ],
      },
    ],
  },
  {
    id: 'opleidingen',
    label: 'Opleidingen',
    icon: <GraduationCap className="w-4 h-4" />,
    groups: [
      {
        label: 'Zorgopleidingen',
        items: [
          { href: '/opleidingen', label: 'Alle opleidingen', bold: true },
          { href: '/opleidingen/verpleegkunde-mbo', label: 'Verpleegkundige MBO' },
          { href: '/opleidingen/verzorgende-ig', label: 'Verzorgende IG' },
          { href: '/opleidingen/helpende-zorg-welzijn', label: 'Helpende Zorg & Welzijn' },
          { href: '/opleidingen/doktersassistent', label: 'Doktersassistent' },
        ],
      },
      {
        label: 'Omscholing',
        items: [
          { href: '/opleidingen/verpleegkundige-omscholing', label: 'Omscholing verpleegkundige' },
        ],
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: <Calculator className="w-4 h-4" />,
    groups: [
      {
        label: 'Calculators',
        items: [
          { href: '/salaris-calculator', label: 'Salariscalculator', bold: true },
          { href: '/ort-calculator', label: 'ORT Calculator' },
          { href: '/vakantiegeld-berekenen', label: 'Vakantiegeld Calculator' },
          { href: '/eindejaarsuitkering-berekenen', label: 'Eindejaarsuitkering' },
        ],
      },
    ],
  },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverDropdown, setHoverDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setHoverDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sluit alle menus bij route-change
  useEffect(() => {
    setOpenDropdown(null);
    setHoverDropdown(null);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Keyboard: Escape sluit alle dropdowns
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setHoverDropdown(null);
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleLogout() {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  }

  function getInitials(email: string): string {
    return email.slice(0, 2).toUpperCase();
  }

  // Desktop: hover-gedrag met kleine vertraging bij verlaten
  const handleMouseEnter = useCallback((id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoverDropdown(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverDropdown(null);
    }, 120);
  }, []);

  // Actief dropdown = hover (desktop) of click (bij geen hover)
  const activeDropdown = hoverDropdown ?? openDropdown;

  const isPathActive = (id: string) => {
    if (id === 'vacatures') return pathname.startsWith('/vacatures');
    if (id === 'salaris-cao') return pathname.startsWith('/salaris') || pathname.startsWith('/cao');
    if (id === 'beroepen') return pathname.startsWith('/beroepen');
    if (id === 'opleidingen') return pathname.startsWith('/opleidingen');
    if (id === 'tools') return pathname.includes('calculator') || pathname.includes('berekenen');
    return false;
  };

  const isEmployer = user?.role === 'ROLE_EMPLOYER';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${
        isScrolled
          ? 'shadow-md border-b border-slate-200'
          : 'border-b border-slate-100'
      }`}
      role="banner"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <nav
          ref={navRef}
          className="flex items-center h-16 lg:h-[72px] gap-4"
          aria-label="Hoofdnavigatie"
        >

          {/* ── LOGO ─────────────────────────────────────────────────────── */}
          <div className="flex items-center shrink-0 mr-6">
            <Link href="/" aria-label="ZorgWerkwijzer — ga naar homepagina">
              <Image
                src="/images/zorgwerkwijzer-logo.png"
                alt="ZorgWerkwijzer"
                width={200}
                height={56}
                className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* ── DESKTOP NAVIGATIE ─────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">

            {navigation.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setOpenDropdown((prev) => prev === item.id ? null : item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 ${
                    activeDropdown === item.id || isPathActive(item.id)
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                  aria-expanded={activeDropdown === item.id}
                  aria-haspopup="true"
                >
                  {item.icon}
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === item.id ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Desktop dropdown panel */}
                {activeDropdown === item.id && (
                  <div
                    className="absolute left-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50"
                    style={{ minWidth: '240px' }}
                    role="menu"
                    aria-label={`${item.label} submenu`}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.groups.map((group, gi) => (
                      <div key={group.label}>
                        {gi > 0 && <div className="border-t border-slate-100 mx-3 my-1" aria-hidden="true" />}
                        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {group.label}
                        </p>
                        {group.items.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            role="menuitem"
                            onClick={() => {
                              setOpenDropdown(null);
                              setHoverDropdown(null);
                            }}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:bg-sky-50 focus-visible:text-sky-700 ${
                              link.bold
                                ? 'font-semibold text-slate-900'
                                : 'text-slate-700 hover:text-sky-600'
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                    <div className="pb-2" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {/* Nieuws — directe link, geen dropdown */}
            <Link
              href="/nieuws"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 ${
                pathname.startsWith('/nieuws')
                  ? 'text-sky-600 bg-sky-50'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
              }`}
            >
              <Newspaper className="w-4 h-4" aria-hidden="true" />
              Nieuws
            </Link>
          </div>

          {/* ── DESKTOP RECHTERZIJDE: CTA + Auth ─────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 ml-auto">
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" aria-hidden="true" />
            ) : isAuthenticated && user ? (
              <>
                {/* Primaire CTA: Vacature Plaatsen — altijd zichtbaar voor werkgevers */}
                {isEmployer && (
                  <Link
                    href="/dashboard/vacatures/nieuw"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                  >
                    <PlusCircle className="w-4 h-4" aria-hidden="true" />
                    Vacature Plaatsen
                  </Link>
                )}

                {/* Admin Panel knop — alleen zichtbaar voor ROLE_ADMIN */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1"
                  >
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Admin Panel
                  </Link>
                )}

                {/* Gebruikersmenu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label={isEmployer ? 'Dashboard menu' : 'Mijn account menu'}
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0"
                      aria-hidden="true"
                    >
                      {getInitials(user.email)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden xl:block">
                      {isEmployer ? 'Dashboard' : 'Mijn Account'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden py-1"
                      role="menu"
                      aria-label={isEmployer ? 'Dashboard navigatie' : 'Account navigatie'}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      {isEmployer ? (
                        <>
                          <UserMenuItem
                            href="/dashboard"
                            icon={<LayoutDashboard className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Werkgeversdashboard
                          </UserMenuItem>
                          <UserMenuItem
                            href="/dashboard/bedrijf"
                            icon={<Building2 className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Bedrijfsprofiel
                          </UserMenuItem>
                          <UserMenuItem
                            href="/dashboard/vacatures"
                            icon={<Briefcase className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Vacatures
                          </UserMenuItem>
                          <UserMenuItem
                            href="/dashboard/sollicitaties"
                            icon={<ClipboardList className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sollicitaties
                          </UserMenuItem>
                        </>
                      ) : (
                        <>
                          <UserMenuItem
                            href="/profiel"
                            icon={<User className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Mijn Profiel
                          </UserMenuItem>
                          <UserMenuItem
                            href="/mijn-sollicitaties"
                            icon={<FileText className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Mijn Sollicitaties
                          </UserMenuItem>
                          <UserMenuItem
                            href="/mijn-vacatures"
                            icon={<Bookmark className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Opgeslagen Vacatures
                          </UserMenuItem>
                        </>
                      )}
                      {/* Admin Panel link in dropdown */}
                      {isAdmin && (
                        <>
                          <div className="border-t border-slate-100 mt-1" aria-hidden="true" />
                          <UserMenuItem
                            href="/admin"
                            icon={<Settings className="w-4 h-4" />}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </UserMenuItem>
                        </>
                      )}
                      <div className="border-t border-slate-100 mt-1" aria-hidden="true" />
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        Uitloggen
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Niet ingelogd: Vacature Plaatsen primaire CTA */}
                <Link
                  href="/werkgever"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  Vacature Plaatsen
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors rounded-xl hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  Inloggen
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600 rounded-xl transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                >
                  <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  Registreren
                </Link>
              </>
            )}
          </div>

          {/* ── TABLET nav (md–lg) ──────────────────────────────────────── */}
          <div className="hidden md:flex lg:hidden items-center gap-1 flex-1 justify-center">
            <NavPill href="/vacatures" active={pathname.startsWith('/vacatures')}>Vacatures</NavPill>
            <NavPill href="/salaris" active={pathname.startsWith('/salaris')}>Salarissen</NavPill>
            <NavPill href="/cao" active={pathname.startsWith('/cao')}>CAO&apos;s</NavPill>
            <NavPill href="/beroepen" active={pathname.startsWith('/beroepen')}>Beroepen</NavPill>
            <NavPill href="/opleidingen" active={pathname.startsWith('/opleidingen')}>Opleidingen</NavPill>
            <NavPill href="/salaris-calculator" active={pathname.includes('calculator') || pathname.includes('berekenen')}>Tools</NavPill>
          </div>
          <div className="hidden md:flex lg:hidden items-center gap-2 shrink-0">
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/werkgever" className="px-3.5 py-1.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm whitespace-nowrap">
                  Vacature Plaatsen
                </Link>
                <Link href="/login" className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
                  Inloggen
                </Link>
              </>
            )}
            {!isLoading && isAuthenticated && user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50"
                aria-label={isMobileMenuOpen ? 'Sluit menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

          {/* ── MOBIEL hamburger ────────────────────────────────────────── */}
          <div className="flex md:hidden items-center ml-auto gap-2">
            {/* Vacature Plaatsen CTA ook mobiel zichtbaar */}
            {!isLoading && !isAuthenticated && (
              <Link
                href="/werkgever"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Plaatsen
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50"
              aria-label={isMobileMenuOpen ? 'Sluit menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </nav>
      </div>

      {/* ── MOBIEL MENU ──────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-slate-100 py-3 px-4 max-h-[80vh] overflow-y-auto"
          role="dialog"
          aria-modal="false"
          aria-label="Mobiel navigatiemenu"
        >
          <div className="flex flex-col gap-0.5">

            {/* Auth-knoppen bovenaan (uitgelogd) */}
            {!isLoading && !isAuthenticated && (
              <div className="flex flex-col gap-2 pb-4 mb-3 border-b border-slate-100">
                <Link
                  href="/werkgever"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 bg-sky-600 hover:bg-sky-700 rounded-2xl text-white font-bold text-sm transition-colors min-h-[48px]"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  Vacature Plaatsen
                </Link>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-2xl text-slate-700 font-semibold text-sm hover:border-sky-300 hover:text-sky-700 transition-colors min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    Inloggen
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-2xl text-slate-700 font-semibold text-sm hover:border-sky-300 hover:text-sky-700 transition-colors min-h-[44px]"
                  >
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                    Registreren
                  </Link>
                </div>
              </div>
            )}

            {/* Auth-info + Vacature Plaatsen CTA (ingelogd werkgever) */}
            {!isLoading && isAuthenticated && user && (
              <div className="pb-3 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold shrink-0" aria-hidden="true">
                    {getInitials(user.email)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate">{user.email}</span>
                </div>
                {isEmployer && (
                  <Link
                    href="/dashboard/vacatures/nieuw"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 rounded-2xl text-white font-bold text-sm transition-colors min-h-[44px]"
                  >
                    <PlusCircle className="w-4 h-4" aria-hidden="true" />
                    Vacature Plaatsen
                  </Link>
                )}
              </div>
            )}

            {/* Navigatiesecties vanuit configuratie */}
            {navigation.map((item) => (
              <MobileSection
                key={item.id}
                label={item.label}
                icon={item.icon}
                defaultOpen={isPathActive(item.id)}
              >
                {item.groups.map((group, gi) => (
                  <div key={group.label}>
                    {gi > 0 && (
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-3 pb-1">
                        {group.label}
                      </p>
                    )}
                    {group.items.map((link) => (
                      <MobileSubLink
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        bold={link.bold}
                      >
                        {link.label}
                      </MobileSubLink>
                    ))}
                  </div>
                ))}
              </MobileSection>
            ))}

            {/* Nieuws directe link */}
            <Link
              href="/nieuws"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-2 text-slate-700 font-semibold text-base border-b border-slate-50 min-h-[48px]"
            >
              <Newspaper className="w-5 h-5 text-slate-400" aria-hidden="true" />
              Nieuws
            </Link>

            {/* Ingelogd gebruikersmenu */}
            {!isLoading && isAuthenticated && user && (
              <div className="border-t border-slate-100 pt-3 mt-2" role="navigation" aria-label="Accountnavigatie">
                {isEmployer ? (
                  <>
                    <MobileAccountLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Werkgeversdashboard
                    </MobileAccountLink>
                    <MobileAccountLink href="/dashboard/bedrijf" icon={<Building2 className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Bedrijfsprofiel
                    </MobileAccountLink>
                    <MobileAccountLink href="/dashboard/vacatures" icon={<Briefcase className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Vacatures
                    </MobileAccountLink>
                    <MobileAccountLink href="/dashboard/sollicitaties" icon={<ClipboardList className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Sollicitaties
                    </MobileAccountLink>
                  </>
                ) : (
                  <>
                    <MobileAccountLink href="/profiel" icon={<User className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Mijn Profiel
                    </MobileAccountLink>
                    <MobileAccountLink href="/mijn-sollicitaties" icon={<FileText className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Mijn Sollicitaties
                    </MobileAccountLink>
                    <MobileAccountLink href="/mijn-vacatures" icon={<Bookmark className="w-5 h-5 text-slate-400" />} onClick={() => setIsMobileMenuOpen(false)}>
                      Opgeslagen Vacatures
                    </MobileAccountLink>
                  </>
                )}
                {isAdmin && (
                  <MobileAccountLink href="/admin" icon={<Settings className="w-5 h-5 text-violet-500" />} onClick={() => setIsMobileMenuOpen(false)}>
                    Admin Panel
                  </MobileAccountLink>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-red-600 font-medium w-full mt-1 min-h-[48px]"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                  Uitloggen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Helper componenten ───────────────────────────────────────────────────────

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
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-700 transition-colors focus-visible:outline-none focus-visible:bg-sky-50 focus-visible:text-sky-700"
    >
      <span className="text-slate-400" aria-hidden="true">{icon}</span>
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
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
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
  defaultOpen = false,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = `mobile-section-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="border-b border-slate-50">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-3 px-2 text-slate-700 font-semibold text-base min-h-[48px]"
        aria-expanded={open}
        aria-controls={sectionId}
      >
        <span className="flex items-center gap-3">
          <span aria-hidden="true">{icon}</span>
          {label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div id={sectionId} className="pl-8 pb-3 flex flex-col gap-0.5">
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
      className={`flex items-center gap-2 py-2.5 text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:text-sky-600 ${
        bold ? 'font-semibold text-slate-800 hover:text-sky-700' : 'text-slate-600 hover:text-sky-600'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileAccountLink({
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
      className="flex items-center gap-3 py-3 text-slate-700 font-medium hover:text-sky-700 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:text-sky-700"
    >
      <span aria-hidden="true">{icon}</span>
      {children}
    </Link>
  );
}
