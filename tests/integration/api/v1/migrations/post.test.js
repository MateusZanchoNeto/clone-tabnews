import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

async function searchMigrationsFromDatabase() {
  return await database.query("SELECT COUNT(*)::int FROM pgmigrations;");
}

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const firstResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(firstResponse.status).toBe(201);

        const firstResponseBody = await firstResponse.json();
        expect(Array.isArray(firstResponseBody)).toBe(true);
        expect(firstResponseBody.length).toBeGreaterThan(0);

        const migrationsFromDatabaseResult =
          await searchMigrationsFromDatabase();
        const migrationsFromDatabaseValue =
          migrationsFromDatabaseResult.rows[0].count;
        expect(migrationsFromDatabaseValue).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const secondResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(secondResponse.status).toBe(200);

        const secondResponseBody = await secondResponse.json();
        expect(Array.isArray(secondResponseBody)).toBe(true);
        expect(secondResponseBody.length).toBe(0);

        const migrationsFromDatabaseResult =
          await searchMigrationsFromDatabase();
        const migrationsFromDatabaseValue =
          migrationsFromDatabaseResult.rows[0].count;
        expect(migrationsFromDatabaseValue).toBeGreaterThan(0);
      });
      test("Updating migrations", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "PUT",
          },
        );
        expect(response.status).toBe(405);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "MethodNotAllowedError",
          message: "Método não permitido para este endpoint.",
          action:
            "Verifique se o método HTTP enviado é válido para este endpoint.",
          status_code: 405,
        });
      });
    });
  });
});
