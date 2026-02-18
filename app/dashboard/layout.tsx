import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-slate-50">
      <header className="border-b border-slate-900 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="font-semibold tracking-tight">
                Smart Bookmark
              </Link>
              <span className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-0.5 text-xs text-slate-300">
                Dashboard
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="text-slate-200">
                <Link href="/">Back to landing</Link>
              </Button>
              <LogoutButton />
            </div>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <Separator className="border-slate-900 bg-slate-900" />

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-slate-900 bg-slate-950/60 p-4">
          <nav className="space-y-1 text-sm">
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-slate-200 hover:bg-slate-900/50"
            >
              Bookmarks
            </Link>
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
            >
              Features
            </Link>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}

