import type { User } from '@supabase/supabase-js';

function pickName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return '';

  const metadata = user.user_metadata ?? {};
  const candidates = [
    metadata.display_name,
    metadata.full_name,
    metadata.name,
    metadata.nickname,
    metadata.user_name,
    metadata.preferred_username,
  ];

  for (const candidate of candidates) {
    const name = pickName(candidate);
    if (name) return name;
  }

  return user.email ?? '';
}
