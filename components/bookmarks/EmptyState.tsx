import { BookmarkPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center animate-section">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20">
        <BookmarkPlus className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-50">
        Your library is empty
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        Add your first bookmark to start building a collection you can search
        and revisit anytime.
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={onCreate}
          className="bg-sky-500 text-slate-950 hover:bg-sky-400"
        >
          Create bookmark
        </Button>
      </div>
    </div>
  );
}

