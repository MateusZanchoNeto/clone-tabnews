const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      setTimeout(checkPostgres, 1);
      return;
    }

    console.log("\nPosgres is ready to accept connections!\n");
  }
}

process.stdout.write("\n\nWaiting for Postgres to be ready");
checkPostgres();
