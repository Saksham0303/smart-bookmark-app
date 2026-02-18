'use client';

import * as React from 'react';
import Link from 'next/link';
import { BadgeCheck, FolderKanban, PlusCircle } from 'lucide-react';

import { OpenBookModel } from '@/components/OpenBookModel';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: 'Add a bookmark',
    description:
      'Paste a URL, give it a clear title, and optionally add notes and tags.',
    icon: PlusCircle,
  },
  {
    title: 'Organize as you go',
    description:
      'Keep collections tidy with tags and consistent cards that are easy to skim.',
    icon: FolderKanban,
  },
  {
    title: 'Find it instantly',
    description:
      'A predictable structure makes searching and filtering effortless as you grow.',
    icon: BadgeCheck,
  },
];

export function HowItWorksSection() {
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal();
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal();
  const [visibleSteps, setVisibleSteps] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    steps.forEach((_, index) => {
      const element = document.getElementById(`step-${index}`);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSteps((prev) => new Set(prev).add(index));
            }, index * 150);
            observer.unobserve(element);
          }
        },
        { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section id="how-it-works" className="px-6 py-12 bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <div
            ref={leftRef as React.RefObject<HTMLDivElement>}
            className={`space-y-6 scroll-reveal reveal-fade-left ${
              leftVisible ? 'revealed' : ''
            }`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80">
              Simple workflow
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
              From link to library in seconds
            </h2>
            <p className="mt-4 max-w-xl text-slate-400">
              Capture the web as you browse. Build a bookmark collection that&apos;s
              easy to maintain and a pleasure to revisit.
            </p>
            <div className="grid gap-4">
              {steps.map((s, index) => (
                <div
                  key={s.title}
                  id={`step-${index}`}
                  className={`hover-card rounded-xl border border-slate-900 bg-slate-950/60 p-6 scroll-reveal reveal-slide-up transition-all duration-600 ${
                    visibleSteps.has(index) ? 'revealed' : ''
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20 transition-transform duration-300 hover:scale-110">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">{s.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef as React.RefObject<HTMLDivElement>}
            className={`rounded-2xl border border-slate-900 bg-slate-950/60 p-4 md:p-6 scroll-reveal reveal-fade-right ${
              rightVisible ? 'revealed' : ''
            }`}
          >
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-sky-400/80">
              Reading view
            </div>
            <p className="mb-4 text-sm text-slate-400">
              Visualize an open book as the destination for the links you save,
              ready to be revisited when you need them.
            </p>

            <div style={{ transform: `translateY(${rightVisible ? 0 : 8}px)` }}>
              <OpenBookModel />
            </div>

            <div className="mt-6 flex flex-col items-start gap-3">
              <h4 className="text-lg font-medium text-slate-100">Start your library</h4>
              <p className="text-sm text-slate-400 max-w-sm">
                Save links to the reading view and open your dashboard to manage bookmarks, tags, and notes.
              </p>                                                                        
            </div>
          </div>
        </div>

        <div className="mt-12 hover-card rounded-2xl border border-slate-900 bg-gradient-to-br from-slate-900/30 via-slate-950/60 to-slate-900/20 p-8 md:p-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-semibold text-slate-50">Ready to build your library?</h3>
                <p className="mt-3 text-sm text-slate-400">
                  Start saving links to your reading view and organize them with tags and notes.
                  Your library stays in sync across devices and is searchable by title, URL, notes, or tags.
                </p>

                <ul className="mt-4 grid gap-2 text-sm text-slate-400">
                  <li>• Quick capture: save links in seconds with a clear title.</li>
                  <li>• Organize: tags and notes make recall easy.</li>
                  <li>• Search & filter: find what matters when you need it.</li>
                </ul>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <Link href="/dashboard">
                  <Button className="btn-primary px-5 py-2 hover:scale-105 transition-transform">
                    Open dashboard
                  </Button>
                </Link>
                <Button asChild variant="outline" className="btn-ghost-hero border-slate-700">
                  <Link href="/">Explore features</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
