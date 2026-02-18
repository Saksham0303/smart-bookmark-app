'use client';

import * as React from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, MoreHorizontal, Tag, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Bookmark } from '@/lib/bookmarks';
import { toast } from '@/hooks/use-toast';

export function BookmarkCard({
  bookmark,
  onRemove,
  onToggleFavorite,
}: {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast({ title: 'Link copied', description: 'URL copied to clipboard.' });
  };

  return (
    <Card className="border-slate-900 bg-slate-950/60 hover-card animate-section">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(bookmark.id)}
              aria-pressed={bookmark.favorite}
              className={
                `rounded-full p-1.5 text-xs transition-colors ` +
                (bookmark.favorite
                  ? 'border border-yellow-400/80 bg-yellow-500/10 text-yellow-300'
                  : 'border border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-yellow-400/60 hover:bg-yellow-500/10 hover:text-yellow-300')
              }
            >
              ★
            </button>
            <CardTitle className="text-base text-slate-50">
              {bookmark.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-200"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-slate-800 bg-slate-950">
              <DropdownMenuItem onClick={copyLink} className="text-slate-200">
                <Copy className="mr-2 h-4 w-4" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={bookmark.url}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:text-slate-200"
              >
                {bookmark.url}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm break-all border-slate-800 bg-slate-900">
              {bookmark.url}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookmark.notes ? (
          <p className="text-sm text-slate-300">{bookmark.notes}</p>
        ) : null}

        {bookmark.tags.length ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Tag className="h-3.5 w-3.5" />
              Tags
            </span>
            {bookmark.tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="bg-slate-900 text-slate-200"
              >
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Added {new Date(bookmark.createdAt).toLocaleDateString()}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-800 bg-transparent text-slate-200 hover:bg-slate-900"
          onClick={() => setDeleteOpen(true)}
        >
          Remove
        </Button>
      </CardFooter>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-slate-800 bg-slate-950">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-50">Remove bookmark?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              &quot;{bookmark.title}&quot; will be removed from your library. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  await Promise.resolve(onRemove(bookmark.id));
                  setDeleteOpen(false);
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

