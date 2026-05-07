import { describe, expect, it } from 'vitest';
import { getSafeNextPath } from './redirect';

describe('getSafeNextPath', () => {
  it('allows known in-app paths', () => {
    expect(getSafeNextPath('/dashboard')).toBe('/dashboard');
    expect(getSafeNextPath('/transactions/123')).toBe('/transactions/123');
    expect(getSafeNextPath('/update-password')).toBe('/update-password');
  });

  it('rejects external and unknown paths', () => {
    expect(getSafeNextPath(null)).toBe('/dashboard');
    expect(getSafeNextPath('https://evil.example')).toBe('/dashboard');
    expect(getSafeNextPath('//evil.example')).toBe('/dashboard');
    expect(getSafeNextPath('/admin')).toBe('/dashboard');
  });
});
