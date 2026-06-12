import { describe, expect, it } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { getUserDisplayName } from './display-name';

function makeUser(metadata: Record<string, unknown>, email?: string): User {
  return {
    id: 'user-id',
    app_metadata: {},
    user_metadata: metadata,
    aud: 'authenticated',
    created_at: '',
    email: email ?? 'user@example.com',
  } as User;
}

describe('getUserDisplayName', () => {
  it('uses display_name for email signup users', () => {
    expect(getUserDisplayName(makeUser({ display_name: '윤보라' }))).toBe(
      '윤보라'
    );
  });

  it('uses full_name for Kakao OAuth users', () => {
    expect(
      getUserDisplayName(
        makeUser(
          { full_name: '윤보라', nickname: 'bora' },
          'kakao@placeholder.local'
        )
      )
    ).toBe('윤보라');
  });

  it('falls back to email when no name metadata exists', () => {
    expect(getUserDisplayName(makeUser({}, 'bora@gmail.com'))).toBe(
      'bora@gmail.com'
    );
  });
});
