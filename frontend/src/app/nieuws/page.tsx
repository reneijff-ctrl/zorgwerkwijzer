import Link from 'next/link';
import { Metadata } from 'next';
import { articles } from '@/lib/news';
import { Calendar, Clock, User, ChevronRight, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Laatste Nieuws & Blogs voor de Zorg | Zorgwerkwijzer',
  description: 'Blijf op de hoogte van het laatste nieuws over CAO VVT, salarissen, ORT en meer in de Nederlandse zorgsector.',
  alternates: {
    canonical: 'https://www.zorgwerkwijzer.nl/nieuws',
  },
};

export default function NieuwsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-2xl mb-6">
            <Newspaper className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Laatste <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Nieuws & Insights</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Actuele informatie over CAO-wijzigingen, salarisontwikkelingen en handige tips voor zorgmedewerkers.
          </p>
        </div>

        {/* Featured Article (The most recent one) */}
        {articles.length > 0 && (
          <div className="mb-16">
            <Link href={`/nieuws/${articles[0].slug}`} className="group relative block overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full min-h-[320px] bg-slate-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 mix-blend-multiply" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Newspaper className="h-24 w-24 text-white/50" />
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full">
                      {articles[0].category}
                    </span>
                    <span className="flex items-center text-slate-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(articles[0].date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-sky-600 transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    {articles[0].description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{articles[0].author}</p>
                        <p className="text-xs text-slate-500">{articles[0].readingTime} leestijd</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                      Lees meer <ChevronRight className="ml-1 h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <Link 
              key={article.slug} 
              href={`/nieuws/${article.slug}`}
              className="group flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Newspaper className="h-12 w-12 text-slate-300" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                    {article.category}
                  </span>
                  <span className="flex items-center text-slate-400 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readingTime}
                  </span>
                  <span className="text-sm font-bold text-sky-600 flex items-center">
                    Lees meer <ChevronRight className="ml-0.5 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
