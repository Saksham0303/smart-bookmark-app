'use client';

import * as React from 'react';
import { Bookmark, Link2, Search, Sparkles } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const features = [
  {
    title: 'Save fast, stay organized',
    description:
      'Capture links with titles, notes, and tags so your knowledge never gets lost.',
    icon: Bookmark,
  },
  {
    title: 'Clean cards for quick scanning',
    description:
      'A consistent card layout makes it easy to browse and revisit what matters.',
    icon: Link2,
  },
  {
    title: 'Search-ready structure',
    description:
      'Designed for filtering and search, so your bookmark library scales with you.',
    icon: Search,
  },
  {
    title: 'Smart by design',
    description:
      'A foundation built for recommendations, deduplication, and insights later.',
    icon: Sparkles,
  },
];

export function FeaturesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const [visibleCards, setVisibleCards] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    features.forEach((_, index) => {
      const element = document.getElementById(`feature-card-${index}`);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, index * 100);
            observer.unobserve(element);
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section id="features" className="px-6 pt-6 pb-12 bg-black">
      <div className="mx-auto max-w-6xl">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`max-w-2xl scroll-reveal reveal-fade-up ${
            headerVisible ? 'revealed' : ''
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80">
            Built for real bookmarking
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
            A home for links you actually want to revisit
          </h2>
          <p className="mt-4 text-slate-400">
            Smart Bookmark focuses on capture, clarity, and retrieval—so your
            saved links become a library instead of a graveyard.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, index) => (
            <div
              key={f.title}
              id={`feature-card-${index}`}
              className={`scroll-reveal reveal-scale transition-all duration-500 ${
                visibleCards.has(index) ? 'revealed' : ''
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="border-slate-900 bg-slate-950/60 p-6 text-slate-100 hover-card h-full">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20 transition-transform duration-300 hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{f.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{f.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

