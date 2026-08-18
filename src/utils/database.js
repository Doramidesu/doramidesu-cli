const fs = require("fs");
const mysql = require("mysql2/promise");

const { spawn } = require("child_process");

const { input, password } = require("@inquirer/prompts");

async function promptMySQLConfig(defaults = {}) {
  const host = await input({
    message: "Database host:",
    default: defaults.host || "127.0.0.1",
  });

  const port = await input({
    message: "Database port:",
    default: String(defaults.port || 3306),
  });

  const database = await input({
    message: "Database name:",
    required: true,
  });

  const username = await input({
    message: "Database username:",
    default: defaults.username || "root",
  });

  const dbPassword = await password({
    message: "Database password:",
    mask: "*",
  });

  return {
    host,
    port: Number(port),
    database,
    username,
    password: dbPassword,
  };
}

function buildLaravelDatabaseConfig(config) {
  return {
    DB_CONNECTION: "mysql",
    DB_HOST: config.host,
    DB_PORT: config.port,
    DB_DATABASE: config.database,
    DB_USERNAME: config.username,
    DB_PASSWORD: config.password,
  };
}

async function connectMySQL(config) {
  return mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
  });
}

async function ensureDatabase(connection, databaseName) {
  const [databases] = await connection.query("SHOW DATABASES LIKE ?", [
    databaseName,
  ]);

  if (databases.length > 0) {
    return false;
  }

  await connection.query(`CREATE DATABASE \`${databaseName}\``);

  return true;
}

function runLaravelMigrations(projectPath) {
  return new Promise((resolve, reject) => {
    const process = spawn("php", ["artisan", "migrate", "--force"], {
      cwd: projectPath,
      stdio: "inherit",
    });

    process.on("error", reject);

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Laravel migration failed with exit code ${code}`));
      }
    });
  });
}

function getDatabaseErrorMessage(error) {
  if (error.code === "ECONNREFUSED") {
    return "MySQL server is not running or cannot be reached.";
  }

  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return "MySQL username or password is incorrect.";
  }

  return error.message;
}

function configureLaravelEnv(projectPath, config) {
  const envPath = `${projectPath}/.env`;
  let envContent = fs.readFileSync(envPath, "utf8");

  const databaseConfig = buildLaravelDatabaseConfig(config);

  for (const [key, value] of Object.entries(databaseConfig)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");

    if (pattern.test(envContent)) {
      envContent = envContent.replace(pattern, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, envContent);
}

module.exports = {
  promptMySQLConfig,
  buildLaravelDatabaseConfig,
  configureLaravelEnv,
  connectMySQL,
  ensureDatabase,
  runLaravelMigrations,
  getDatabaseErrorMessage,
};
