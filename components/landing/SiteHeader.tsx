"use client";

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const user = useUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const btn = document.getElementById('hero-signin-btn');
    if (btn) {
      btn.classList.remove('btn-shine');
      // trigger reflow to restart animation
      btn.offsetWidth;
      btn.classList.add('btn-shine');
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (btn as HTMLElement).focus();
      setTimeout(() => btn.classList.remove('btn-shine'), 1400);
    } else {
      // fallback scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function UserGetStarted() {
    if (user) return <LogoutButton />;
    return (
      <a
        href="#cta"
        onClick={handleGetStarted}
        className="transition-colors hover:text-slate-50 hover:scale-105 inline-block"
      >
        Get started
      </a>
    );
  }

  function MobileGetStarted() {
    if (user) return <LogoutButton />;
    return (
      <button onClick={handleGetStarted} className="px-2 py-2 text-left">Get started</button>
    );
  }

  return (
    <header
      className={`sticky top-0 z-20 border-b transition-all duration-300 ${
        scrolled
          ? 'border-slate-900/80 bg-black/95 backdrop-blur-md shadow-lg'
          : 'border-slate-900/60 bg-slate-950/70 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30 transition-all duration-300 hover:bg-sky-500/25 hover:ring-sky-500/50">
            SB
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-50">
            Smart Bookmark
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-slate-50 hover:scale-105 inline-block"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-slate-50 hover:scale-105 inline-block"
          >
            How it works
          </a>
          <UserGetStarted />
        </nav>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigate the site</SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-3">
                  <a href="#features" className="px-2 py-2">Features</a>
                  <a href="#how-it-works" className="px-2 py-2">How it works</a>
                  <MobileGetStarted />
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" className="mt-6">Close</Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>

          <Button
            asChild
            variant="ghost"
            className="text-slate-200 transition-all duration-200 hover:scale-105"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            className="bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all duration-200 hover:scale-105"
          >
            <a href="#cta">Create your first bookmark</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

