'use client';

import * as React from 'react';
import { Cloud, Lock, Search, ShieldCheck } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const trustItems = [
  {
    title: 'Private by default',
    description:
      'Your bookmarks are for you. The foundation is built to support private collections first.',
    icon: Lock,
  },
  {
    title: 'Ready for sync',
    description:
      'Designed with realtime sync in mind so you can confidently extend to multiple devices later.',
    icon: Cloud,
  },
  {
    title: 'Search that scales',
    description:
      'Structured metadata makes it easy to plug in fast search as your library grows.',
    icon: Search,
  },
  {
    title: 'Safe and reliable',
    description:
      'A clear model for backups and exports keeps your links portable and under your control.',
    icon: ShieldCheck,
  },
];

export function TrustSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const [visibleCards, setVisibleCards] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    trustItems.forEach((_, index) => {
      const element = document.getElementById(`trust-card-${index}`);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, index * 120);
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
    <section className="px-6 py-12 bg-black">
      <div className="mx-auto max-w-6xl">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`max-w-2xl scroll-reveal reveal-fade-up ${
            headerVisible ? 'revealed' : ''
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80">
            Trust the library
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
            Built for long-term, dependable saving
          </h2>
          <p className="mt-4 text-slate-400">
            Smart Bookmark is opinionated about structure and clarity so it can
            grow into secure, synced, and searchable collections.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              id={`trust-card-${index}`}
              className={`scroll-reveal reveal-fade-left transition-all duration-600 ${
                visibleCards.has(index) ? 'revealed' : ''
              } ${index % 2 === 1 ? 'reveal-fade-right' : ''}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <Card className="border-slate-900 bg-slate-950/60 p-6 text-slate-100 hover-card h-full">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20 transition-transform duration-300 hover:rotate-12">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {item.description}
                    </p>
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

