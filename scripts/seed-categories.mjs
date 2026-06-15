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
  const existing = await listDefaultCategories(sql);
  const missingCount = 13 - existing.length;

  if (missingCount <= 0 && existing.length === 13) {
    console.log('기본 카테고리 13개가 이미 있습니다.');
    for (const category of existing) {
      console.log(`  - ${category.name} (${category.type})`);
    }
    process.exit(0);
  }

  await insertDefaultCategories(sql);

  const categories = await listDefaultCategories(sql);
  console.log(`기본 카테고리 ${categories.length}개 확인:`);
  for (const category of categories) {
    console.log(`  - ${category.name} (${category.type})`);
  }

  if (categories.length > 13) {
    console.log(
      '\n중복 카테고리가 있습니다. npm run db:reset:categories 로 초기화하세요.'
    );
  }
} catch (error) {
  console.error('seed 실패:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
