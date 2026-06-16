'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Naam is verplicht';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres';
    }
    if (!formData.message.trim()) newErrors.message = 'Bericht is verplicht';
    else if (formData.message.length < 10) newErrors.message = 'Bericht moet minimaal 10 tekens bevatten';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Er is een fout opgetreden bij het verzenden.');
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "Hoe snel kan ik een reactie verwachten?",
      answer: "We streven ernaar om alle vragen binnen 2 werkdagen te beantwoorden. Meestal hoor je echter al veel sneller van ons!"
    },
    {
      question: "Kan ik suggesties doen voor nieuwe tools?",
      answer: "Absoluut! Zorgwerkwijzer is er voor jou. Als je een idee hebt voor een nieuwe calculator of informatie die ontbreekt, laat het ons zeker weten via dit formulier."
    },
    {
      question: "Is mijn data veilig?",
      answer: "Ja, we gaan zeer zorgvuldig om met je gegevens. We gebruiken je e-mailadres alleen om te reageren op je vraag en bewaren dit niet langer dan nodig."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Zorgwerkwijzer",
                "item": "https://zorgwerkwijzer.nl"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Contact",
                "item": "https://zorgwerkwijzer.nl/contact"
              }
            ]
          })
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Contact opnemen
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Heb je een vraag, opmerking of een briljant idee voor Zorgwerkwijzer? 
            We horen het ontzettend graag van je.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details & Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-500" />
                Reactietijd
              </h3>
              <p className="text-slate-600 text-sm">
                We reageren doorgaans binnen 48 uur op werkdagen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                Privacy
              </h3>
              <p className="text-slate-600 text-sm">
                Je gegevens worden vertrouwelijk behandeld en nooit gedeeld met derden.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-2">Help ons groeien</h3>
              <p className="text-primary-100 text-sm mb-4">
                Jouw feedback helpt ons om de beste tools te bouwen voor alle zorgmedewerkers in Nederland.
              </p>
              <HelpCircle className="w-12 h-12 text-primary-300 opacity-20 absolute bottom-4 right-4" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              {isSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Bericht verzonden!</h2>
                  <p className="text-slate-600 mb-8">
                    Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="btn-primary"
                  >
                    Nieuw bericht sturen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                  {errors.form && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start text-red-700 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                      {errors.form}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        Je naam
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none`}
                        placeholder="Bijv. Sanne de Vries"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none`}
                        placeholder="naam@voorbeeld.nl"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-slate-400" />
                        Je bericht
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none`}
                        placeholder="Hoe kunnen we je helpen?"
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-600 font-medium">{errors.message}</p>}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-xl bg-primary-600 text-white font-bold text-lg shadow-lg shadow-primary-200 hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                          Verzenden...
                        </>
                      ) : (
                        <>
                          Bericht verzenden
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                    <p className="mt-4 text-center text-xs text-slate-400">
                      Door op verzenden te klikken ga je akkoord met onze privacyverklaring.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Veelgestelde vragen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-primary-200 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs mr-3 shrink-0 mt-1">Q</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 pl-9 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Notice Card */}
        <div className="mt-12 p-8 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Privacy en vertrouwelijkheid</h4>
            <p className="text-sm text-slate-600">
              Bij Zorgwerkwijzer nemen we privacy serieus. De informatie die je via dit formulier deelt wordt uitsluitend gebruikt om je vraag te beantwoorden. 
              We sturen je geen ongevraagde nieuwsbrieven en verkopen je data nooit aan derden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
