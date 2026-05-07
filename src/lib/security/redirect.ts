const ALLOWED_NEXT_PATHS = [
  '/dashboard',
  '/transactions',
  '/budgets',
  '/analytics',
  '/update-password',
];

export function getSafeNextPath(next: string | null): string {
  if (!next) return '/dashboard';
  if (!next.startsWith('/') || next.startsWith('//')) return '/dashboard';

  return ALLOWED_NEXT_PATHS.some(
    path => next === path || next.startsWith(`${path}/`)
  )
    ? next
    : '/dashboard';
}
