import {
  createPostgresClient,
  insertDefaultCategories,
  listDefaultCategories,
} from './category-seed-data.mjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL 환경 변수가 필요합니다 (.env 확인).');
  process.exit(1);
}

const sql = createPostgresClient(connectionString);

try {
  const before = await listDefaultCategories(sql);
  console.log(`삭제 전 기본 카테고리: ${before.length}개`);

  await sql.begin(async tx => {
    const deleted = await tx`
      delete from public.categories
      where user_id is null
      returning id
    `;

    console.log(`삭제됨: ${deleted.length}개`);

    await insertDefaultCategories(tx);
  });

  const after = await listDefaultCategories(sql);
  console.log(`\n기본 카테고리 ${after.length}개로 초기화 완료:`);
  for (const category of after) {
    console.log(`  - ${category.name} (${category.type})`);
  }

  console.log(
    '\n참고: 삭제된 기본 카테고리를 쓰던 거래는 category_id가 비워지고, 예산은 함께 삭제됩니다.'
  );
} catch (error) {
  console.error('초기화 실패:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
