"use client";

import React from 'react';
import Link from 'next/link';
import { BookModel } from './BookModel';
import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { signInWithGoogle } from '../lib/auth';
import { useUser } from '@/hooks/useUser';

function Hero() {
  const { ref: textRef, isVisible: textVisible } = useScrollReveal({
    threshold: 0.2,
    rootMargin: '0px',
  });
    const { ref: bookRef, isVisible: bookVisible } = useScrollReveal({
      threshold: 0.2,
      rootMargin: '0px',
    });
    const bookContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [parallaxY, setParallaxY] = React.useState(0);

    // BookModel is statically imported so it remains mounted and visible.
  const user = useUser();
  React.useEffect(() => {
    const el = bookContainerRef.current;
    if (!el) return;
    let raf = 0;

    const onScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // small parallax: move slightly based on distance from center
      const offset = (rect.top - window.innerHeight / 2) * -0.03;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setParallaxY(offset));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [bookContainerRef]);

  return (
    <main className="min-h-screen px-6 py-10 bg-black">
      <div className="max-w-6xl mx-auto grid gap-10 items-center md:grid-cols-2">
        <div
          ref={textRef as React.RefObject<HTMLDivElement>}
          className={`space-y-6 text-center md:text-left scroll-reveal reveal-fade-left ${
            textVisible ? 'revealed' : ''
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80 animate-pulse">
            Interactive 3D experience
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-50">
            Open the{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Paladin&apos;s Grimoire
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-400 md:mx-0">
            A magical tome brought to life with Three.js and React Three Fiber.
            Rotate and explore the book as the gateway to your next adventure.
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {user ? (
              <Button asChild className="btn-primary-hero animate-bounce-subtle">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button id="hero-signin-btn" className="btn-primary-hero animate-bounce-subtle" onClick={signInWithGoogle}>
                Sign in
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="btn-ghost-hero border-slate-700 bg-transparent text-slate-100"
            >
              <Link href="#how-it-works">Learn more</Link>
            </Button>
          </div>
        </div>

        <div
          ref={bookRef as React.RefObject<HTMLDivElement>}
          className={`w-full scroll-reveal reveal-fade-right ${bookVisible ? 'revealed' : ''}`}
        >
            <div
              ref={bookContainerRef}
              className="relative hero-glow"
              style={{ transform: `translateY(${parallaxY}px)` }}
            >
              <BookModel />
            </div>
        </div>
      </div>
    </main>
  );
}

export default Hero;

