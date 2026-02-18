import * as React from 'react';
import type { Bookmark } from '@/lib/bookmarks';
import { BookmarkCard } from './BookmarkCard';

export function BookmarkList({
  bookmarks,
  onRemove,
  onToggleFavorite,
}: {
  bookmarks: Bookmark[];
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {bookmarks.map((b, index) => (
        <div
          key={b.id}
          className="bookmark-card-item"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <BookmarkCard
            bookmark={b}
            onRemove={onRemove}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
}

