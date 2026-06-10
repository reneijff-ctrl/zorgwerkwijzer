import { articles } from '@/lib/news';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, User, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) return {};

  return {
    title: `${article.title} | Zorgwerkwijzer`,
    description: article.description,
    alternates: {
      canonical: `https://www.zorgwerkwijzer.nl/nieuws/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      url: `https://www.zorgwerkwijzer.nl/nieuws/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  // Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.description,
    'author': {
      '@type': 'Organization',
      'name': 'Zorgwerkwijzer',
    },
    'datePublished': article.date,
    'publisher': {
      '@type': 'Organization',
      'name': 'Zorgwerkwijzer',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.zorgwerkwijzer.nl/images/zorgwerkwijzer-logo.png'
      }
    }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://www.zorgwerkwijzer.nl'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Nieuws',
        'item': 'https://www.zorgwerkwijzer.nl/nieuws'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': article.title,
        'item': `https://www.zorgwerkwijzer.nl/nieuws/${slug}`
      }
    ]
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/nieuws" 
            className="inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-700 mb-8 group transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Terug naar overzicht
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-t border-slate-200 pt-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{article.author}</p>
                <p className="text-xs">Redacteur</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {article.readingTime} leestijd
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Article Body */}
          <div className="lg:col-span-8">
            <div 
              className="prose prose-lg prose-slate max-w-none 
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900
                prose-ul:text-slate-600 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Social Share */}
            <div className="mt-16 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <Share2 className="mr-2 h-4 w-4" /> Deel dit artikel
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-all">
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-sky-400 hover:bg-sky-50 rounded-full transition-all">
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-700 hover:bg-sky-50 rounded-full transition-all">
                      <Linkedin className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Related Articles */}
          <aside className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                Gerelateerde artikelen
              </h3>
              <div className="space-y-6">
                {relatedArticles.map((rel) => (
                  <Link 
                    key={rel.slug} 
                    href={`/nieuws/${rel.slug}`}
                    className="group block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 h-20 w-20 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                        <Clock className="h-8 w-8 text-slate-300 group-hover:text-sky-200" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-sky-600 uppercase mb-1">{rel.category}</p>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Bereken direct je voordeel</h3>
              <p className="text-sky-100 text-sm mb-8 leading-relaxed">
                Gebruik onze gratis calculators om precies te zien wat de nieuwe CAO voor jouw portemonnee betekent.
              </p>
              <div className="space-y-3">
                <Link 
                  href="/salaris-calculator"
                  className="block w-full py-3 bg-white text-sky-600 text-center text-sm font-bold rounded-xl hover:bg-sky-50 transition-colors"
                >
                  Salaris Calculator
                </Link>
                <Link 
                  href="/ort-calculator"
                  className="block w-full py-3 bg-sky-500 text-white text-center text-sm font-bold rounded-xl hover:bg-sky-400 transition-colors"
                >
                  ORT Calculator
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 px-2">
                Blijf op de hoogte
              </h3>
              <NewsletterForm variant="compact" />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
