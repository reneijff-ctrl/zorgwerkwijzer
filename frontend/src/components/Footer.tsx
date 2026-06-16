import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Branding */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/zorgwerkwijzer-logo.png"
                  alt="Zorgwerkwijzer"
                  width={400}
                  height={120}
                  className="h-[120px] w-auto drop-shadow-md"
                />
              </Link>
            </div>
            <p className="text-base leading-relaxed mb-8 max-w-sm">
              Dé onafhankelijke informatiebron voor zorgmedewerkers in Nederland.
              Bereken je salaris, ORT en blijf op de hoogte van je CAO.
            </p>
          </div>

          {/* Calculators */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Calculators</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/salaris-calculator" className="hover:text-sky-400 transition-colors">Salaris Calculator</Link></li>
              <li><Link href="/ort-calculator" className="hover:text-sky-400 transition-colors">ORT Calculator</Link></li>
              <li><Link href="/vakantiegeld-berekenen" className="hover:text-sky-400 transition-colors">Vakantiegeld</Link></li>
              <li><Link href="/eindejaarsuitkering-berekenen" className="hover:text-sky-400 transition-colors">Eindejaarsuitkering</Link></li>
            </ul>
          </div>

          {/* Salarissen (hernoemd van "Functies") */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Salarissen</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/salaris" className="hover:text-sky-400 transition-colors">Alle salarissen</Link></li>
              <li><Link href="/salaris/verpleegkundige" className="hover:text-sky-400 transition-colors">Verpleegkundige</Link></li>
              <li><Link href="/salaris/verzorgende-ig" className="hover:text-sky-400 transition-colors">Verzorgende IG</Link></li>
              <li><Link href="/salaris/doktersassistent" className="hover:text-sky-400 transition-colors">Doktersassistent</Link></li>
              <li><Link href="/salaris/helpende-plus" className="hover:text-sky-400 transition-colors">Helpende Plus</Link></li>
              <li><Link href="/fwg-uitleg" className="hover:text-sky-400 transition-colors">FWG Schalen</Link></li>
            </ul>
          </div>

          {/* Beroepen (nieuw) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Beroepen</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/beroepen" className="hover:text-sky-400 transition-colors">Alle beroepen</Link></li>
              <li><Link href="/beroepen/verpleegkundige" className="hover:text-sky-400 transition-colors">Verpleegkundige</Link></li>
              <li><Link href="/beroepen/verzorgende-ig" className="hover:text-sky-400 transition-colors">Verzorgende IG</Link></li>
              <li><Link href="/beroepen/fysiotherapeut" className="hover:text-sky-400 transition-colors">Fysiotherapeut</Link></li>
              <li><Link href="/beroepen/gz-psycholoog" className="hover:text-sky-400 transition-colors">GZ-Psycholoog</Link></li>
              <li><Link href="/beroepen/doktersassistent" className="hover:text-sky-400 transition-colors">Doktersassistent</Link></li>
            </ul>
          </div>

          {/* Opleidingen (nieuw) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Opleidingen</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/opleidingen" className="hover:text-sky-400 transition-colors">Alle opleidingen</Link></li>
              <li><Link href="/opleidingen/verpleegkunde-hbo" className="hover:text-sky-400 transition-colors">HBO-Verpleegkunde</Link></li>
              <li><Link href="/opleidingen/verzorgende-ig" className="hover:text-sky-400 transition-colors">Verzorgende IG</Link></li>
              <li><Link href="/opleidingen/fysiotherapie" className="hover:text-sky-400 transition-colors">Fysiotherapie</Link></li>
              <li><Link href="/opleidingen/gz-psycholoog" className="hover:text-sky-400 transition-colors">GZ-Psycholoog</Link></li>
              <li><Link href="/opleidingen/doktersassistent" className="hover:text-sky-400 transition-colors">Doktersassistent</Link></li>
            </ul>
          </div>

          {/* CAO&apos;s & Informatie */}
          <div className="lg:col-span-1 md:hidden lg:block">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">CAO&apos;s</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/cao/vvt" className="hover:text-sky-400 transition-colors">CAO VVT</Link></li>
              <li><Link href="/cao/ziekenhuizen" className="hover:text-sky-400 transition-colors">CAO Ziekenhuizen</Link></li>
              <li><Link href="/cao/ggz" className="hover:text-sky-400 transition-colors">CAO GGZ</Link></li>
              <li><Link href="/cao/gehandicaptenzorg" className="hover:text-sky-400 transition-colors">CAO Gehandicaptenzorg</Link></li>
              <li><Link href="/vacatures" className="hover:text-sky-400 transition-colors">Vacatures</Link></li>
              <li><Link href="/pensioen-zorg" className="hover:text-sky-400 transition-colors">Pensioen</Link></li>
              <li><Link href="/reiskostenvergoeding-zorg" className="hover:text-sky-400 transition-colors">Reiskosten</Link></li>
              <li><Link href="/nieuws" className="hover:text-sky-400 transition-colors">Nieuws</Link></li>
              <li><Link href="/over-ons" className="hover:text-sky-400 transition-colors">Over ons</Link></li>
            </ul>
          </div>

          {/* Nieuwsbrief */}
          <div className="lg:col-span-4 md:col-span-2">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Nieuwsbrief</h3>
            <p className="text-sm mb-6">Ontvang direct updates over CAO wijzigingen en salarissen in de zorg.</p>
            <NewsletterForm variant="footer" />
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} ZorgWerkWijzer. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
