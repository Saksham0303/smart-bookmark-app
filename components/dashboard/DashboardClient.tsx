'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { BookmarkForm } from '@/components/bookmarks/BookmarkForm';
import { BookmarkList } from '@/components/bookmarks/BookmarkList';
import { EmptyState } from '@/components/bookmarks/EmptyState';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Bookmark } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/hooks/useUser';

type SortOption = 'newest' | 'oldest' | 'title';

function filterBookmarks(bookmarks: Bookmark[], query: string): Bookmark[] {
  if (!query.trim()) return bookmarks;
  const q = query.toLowerCase().trim();
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      (b.notes && b.notes.toLowerCase().includes(q)) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function sortBookmarks(bookmarks: Bookmark[], sort: SortOption): Bookmark[] {
  const copy = [...bookmarks];
  if (sort === 'newest') {
    copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'oldest') {
    copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }
  return copy;
}

export function DashboardClient() {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<SortOption>('newest');
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const user = useUser();

  const filtered = React.useMemo(() => {
    let next = sortBookmarks(filterBookmarks(bookmarks, search), sort);
    if (favoritesOnly) {
      next = next.filter((b) => b.favorite);
    }
    return next;
  }, [bookmarks, search, sort, favoritesOnly]);

  React.useEffect(() => {
    let mounted = true;
    if (!user) {
      setBookmarks([]);
      return;
    }

    let mountedLocal = true;

    async function fetchBookmarks() {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bookmarks:', error);
          return;
        }

        if (!mountedLocal) return;

        const next: Bookmark[] = (data || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          url: r.url,
          notes: r.notes ?? undefined,
          tags: Array.isArray(r.tags) ? r.tags : r.tags ? JSON.parse(r.tags) : [],
          createdAt: r.createdAt ?? r.created_at ?? new Date().toISOString(),
          favorite: !!r.favorite,
        }));

        setBookmarks(next);
      } catch (err) {
        console.error('Unexpected error fetching bookmarks:', err);
      }
    }

    fetchBookmarks();

    return () => {
      mounted = false;
      mountedLocal = false;
    };
  }, [user]);

  const handleCreate = (bookmark: Bookmark) => {
    setBookmarks((prev) => [bookmark, ...prev]);
    toast({
      title: 'Bookmark added',
      description: 'Your link is now saved in your dashboard.',
    });
  };

  const handleToggleFavorite = async (id: string) => {
    let newFavorite = false;
    setBookmarks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          newFavorite = !b.favorite;
          return { ...b, favorite: newFavorite };
        }
        return b;
      })
    );

    try {
      const { error } = await supabase.from('bookmarks').update({ favorite: newFavorite }).eq('id', id);
      if (error) {
        console.error('Error updating favorite:', error);
      } else {
        // Refresh bookmarks from the server to ensure persisted state
        if (user) {
          const { data, error: fetchError } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false });

          if (fetchError) {
            console.error('Error re-fetching bookmarks after favorite toggle:', fetchError);
          } else {
            const next: Bookmark[] = (data || []).map((r: any) => ({
              id: r.id,
              title: r.title,
              url: r.url,
              notes: r.notes ?? undefined,
              tags: Array.isArray(r.tags) ? r.tags : r.tags ? JSON.parse(r.tags) : [],
              createdAt: r.createdAt ?? r.created_at ?? new Date().toISOString(),
              favorite: !!r.favorite,
            }));
            setBookmarks(next);
          }
        }
      }
    } catch (e) {
      console.error('Unexpected error updating favorite:', e);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);
      if (error) {
        console.error('Error removing bookmark:', error);
        toast({ title: 'Error', description: 'Could not remove bookmark.' });
        return;
      }
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast({
        title: 'Bookmark removed',
        description: 'The bookmark was removed from your library.',
      });
    } catch (err) {
      console.error('Unexpected error removing bookmark:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookmarks</h1>
        <p className="mt-2 text-sm text-slate-400">
          Capture links with titles, notes, and tags—then browse them as clean,
          consistent cards.
        </p>
      </div>

      <BookmarkForm onCreate={handleCreate} />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-section">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by title, URL, notes, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-slate-800 bg-slate-950/60 pl-9 text-slate-100 placeholder:text-slate-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                favoritesOnly
                  ? 'border-yellow-400/80 bg-yellow-500/10 text-yellow-200'
                  : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
              }`}
            >
              ★ Favorites only
            </button>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-full border-slate-800 bg-slate-950/60 text-slate-200 transition-colors sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950">
                <SelectItem value="newest" className="text-slate-200">
                  Newest first
                </SelectItem>
                <SelectItem value="oldest" className="text-slate-200">
                  Oldest first
                </SelectItem>
                <SelectItem value="title" className="text-slate-200">
                  Title A–Z
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {bookmarks.length ? (
          <>
            <ScrollArea className="h-[calc(100vh-22rem)] min-h-[320px] pr-4">
              <BookmarkList
                bookmarks={filtered}
                onRemove={handleRemove}
                onToggleFavorite={handleToggleFavorite}
              />
            </ScrollArea>
            {filtered.length === 0 && search.trim() ? (
              <p className="text-center text-sm text-slate-500">
                No bookmarks match your search.
              </p>
            ) : null}
          </>
        ) : (
          <EmptyState
            onCreate={() => {
              const el = document.querySelector('input[name="title"]');
              if (el instanceof HTMLInputElement) el.focus();
            }}
          />
        )}
      </div>
    </div>
  );
}

