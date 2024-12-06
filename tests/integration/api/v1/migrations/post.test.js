import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function searchMigrationsFromDatabase() {
  return await database.query("SELECT COUNT(*)::int FROM pgmigrations;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const firstResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const secondResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(firstResponse.status).toBe(201);
  expect(secondResponse.status).toBe(200);

  const firstResponseBody = await firstResponse.json();
  expect(Array.isArray(firstResponseBody)).toBe(true);
  expect(firstResponseBody.length).toBeGreaterThan(0);

  const secondResponseBody = await secondResponse.json();
  expect(Array.isArray(secondResponseBody)).toBe(true);
  expect(secondResponseBody.length).toBe(0);

  const migrationsFromDatabaseResult = await searchMigrationsFromDatabase();
  const migrationsFromDatabaseValue =
    migrationsFromDatabaseResult.rows[0].count;
  expect(migrationsFromDatabaseValue).toBeGreaterThan(0);
});
