import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900 bg-black px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">
          <span className="font-medium text-slate-200">Smart Bookmark</span>{' '}
          <span className="mx-2 text-slate-600">•</span>
          <span>Save what matters. Find it fast.</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link className="text-slate-400 hover:text-slate-200" href="/">
            Home
          </Link>
          <Link className="text-slate-400 hover:text-slate-200" href="/dashboard">
            Dashboard
          </Link>
          <a className="text-slate-400 hover:text-slate-200" href="#features">
            Features
          </a>
        </div>
      </div>
    </footer>
  );
}

