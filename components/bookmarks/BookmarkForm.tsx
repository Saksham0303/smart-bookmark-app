'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { parseTags, normalizeUrl, type Bookmark } from '@/lib/bookmarks';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  title: z.string().min(2, 'Title should be at least 2 characters'),
  url: z
    .string()
    .min(1, 'URL is required')
    .transform((v) => normalizeUrl(v))
    .refine((v) => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, 'Please enter a valid URL'),
  notes: z.string().max(280, 'Notes should be under 280 characters').optional(),
  tags: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function BookmarkForm({
  onCreate,
}: {
  onCreate: (bookmark: Bookmark) => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', url: '', notes: '', tags: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: Values) => {
    // Check auth at submit time — does NOT affect layout
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Sign in to save bookmarks',
        description: 'Create an account to start saving links.',
      });
      return;
    }

    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      title: values.title.trim(),
      url: values.url,
      notes: values.notes?.trim() ? values.notes.trim() : undefined,
      tags: values.tags ? parseTags(values.tags) : [],
      createdAt: new Date().toISOString(),
      favorite: false,
    };

    try {
      const { error } = await supabase.from('bookmarks').insert([
        {
          id: bookmark.id,
          title: bookmark.title,
          url: bookmark.url,
          notes: bookmark.notes ?? null,
          tags: bookmark.tags,
          favorite: false,
          created_at: bookmark.createdAt,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error('Error inserting bookmark:', error);
        toast({ title: 'Error', description: 'Could not save bookmark.' });
        return;
      }

      onCreate(bookmark);
      form.reset();
    } catch (err) {
      console.error('Unexpected error inserting bookmark:', err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 rounded-xl border border-slate-900 bg-slate-950/60 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A great article on web performance"
                    className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200">Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What should you remember about this link?"
                  className="min-h-[96px] border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200">Tags (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="design, react, productivity"
                  className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <Button
            type="submit"
            className="bg-sky-500 text-slate-950 hover:bg-sky-400"
          >
            Add bookmark
          </Button>
        </div>
      </form>
    </Form>
  );
}