module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능 추가
        'fix',      // 버그 수정
        'chore',    // 빌드 프로세스나 보조 도구 변경
        'docs',     // 문서 변경
        'refactor', // 코드 리팩토링
        'style',    // 코드 스타일 변경 (포맷팅 등)
        'perf',     // 성능 개선
        'test',     // 테스트 관련 변경
        'build',    // 빌드 시스템 변경
        'ci',       // CI 설정 변경
        'revert',   // 이전 커밋 되돌리기
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
  },
};
