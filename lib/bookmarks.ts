export type Bookmark = {
  id: string;
  title: string;
  url: string;
  notes?: string;
  tags: string[];
  createdAt: string; // ISO string
  favorite?: boolean;
};

export function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Allow users to paste "example.com" without protocol.
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function parseTags(input: string) {
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

