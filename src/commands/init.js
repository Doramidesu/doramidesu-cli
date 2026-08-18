const { execSync } = require("child_process");
const { checkCommand } = require("../utils/checkCommand");
const laravelConfig = require("../config/frameworks/laravel");
const fs = require("fs");

const {
  promptMySQLConfig,
  connectMySQL,
  ensureDatabase,
  configureLaravelEnv,
  runLaravelMigrations,
  getDatabaseErrorMessage,
} = require("../utils/database");

const frameworks = ["laravel", "lumen", "express", "react", "next"];

const requirements = {
  laravel: [
    {
      command: "php -v",
      label: "PHP",
    },
    {
      command: "composer --version",
      label: "Composer",
    },
  ],

  lumen: [
    {
      command: "php -v",
      label: "PHP",
    },
    {
      command: "composer --version",
      label: "Composer",
    },
  ],

  express: [
    {
      command: "node -v",
      label: "Node.js",
    },
    {
      command: "npm -v",
      label: "npm",
    },
  ],
};

const installers = {
  laravel: "composer create-project laravel/laravel",

  lumen: "composer create-project laravel/lumen",

  express: "npx --yes express-generator",
};

const nextSteps = {
  laravel: {
    commands: ["php artisan serve"],
    url: "http://127.0.0.1:8000",
  },

  lumen: {
    commands: ["php -S localhost:8000 -t public"],

    url: "http://localhost:8000",
  },

  express: {
    commands: ["npm install", "npm start"],
    url: "http://localhost:3000",
  },
};

async function init(framework, projectName) {
  if (!framework) {
    console.log("Please specify a framework.\n");
    console.log("Example:");
    console.log("  doramidesu init laravel");
    return;
  }
  if (!frameworks.includes(framework)) {
    console.log(`Unknown framework: ${framework}\n`);

    console.log("Available frameworks:");

    for (const frameworkName of frameworks) {
      console.log(`- ${frameworkName}`);
    }

    return;
  }

  if (!projectName) {
    console.log("Please specify a project name.\n");

    console.log("Example:");
    console.log("  doramidesu init laravel my-app");

    return;
  }

  console.log(`Framework : ${framework}`);
  console.log(`Project   : ${projectName}`);

  console.log("\nChecking Environment...\n");

  const frameworkRequirements =
    framework === "laravel"
      ? laravelConfig.requirements
      : requirements[framework];

  for (const item of frameworkRequirements) {
    const result = checkCommand(item.command, item.label);

    if (result.installed) {
      console.log(`✓ ${item.label.padEnd(10)} : OK`);
    } else {
      console.log(`✗ ${item.label}`);
      return;
    }
  }

  const frameworkName = framework.charAt(0).toUpperCase() + framework.slice(1);

  console.log("\n✓ Environment Ready\n");

  console.log(`Creating ${frameworkName} Project...`);

  const installer =
    framework === "laravel" ? laravelConfig.installer : installers[framework];

  const step = nextSteps[framework];

  if (fs.existsSync(projectName)) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("❌ Project folder already exists!");

    console.log(`\n• Folder "${projectName}" already exists.`);

    console.log("\n• Please choose another project name.");

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return;
  }

  console.log(`\n🚀 Creating ${frameworkName} Project...\n`);

  console.log(
    `Framework : ${framework.charAt(0).toUpperCase() + framework.slice(1)}`,
  );
  console.log(`Project   : ${projectName}`);

  console.log();

  try {
    execSync(`${installer} ${projectName}`, {
      stdio: "inherit",
    });

    // Database setup will be handled here.
    let connection;

    try {
      const databaseConfig = await promptMySQLConfig();

      console.log("\n🗄️ Database Configuration Complete!");

      connection = await connectMySQL(databaseConfig);

      console.log("✅ MySQL connection successful!");

      const databaseCreated = await ensureDatabase(
        connection,
        databaseConfig.database,
      );

      if (databaseCreated) {
        console.log(
          `✅ Database "${databaseConfig.database}" created successfully!`,
        );
      } else {
        console.log(`✅ Database "${databaseConfig.database}" already exists!`);
      }

      const projectPath = require("path").resolve(projectName);

      configureLaravelEnv(projectPath, databaseConfig);

      console.log("✅ Laravel .env configured successfully!");

      await runLaravelMigrations(projectPath);

      console.log("✅ Laravel migrations completed successfully!");
    } catch (error) {
      console.log("\n❌ Database setup failed!");
      console.log(`\nReason: ${getDatabaseErrorMessage(error)}`);
      return;
    } finally {
      if (connection) {
        await connection.end();
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("🎉 Project Created Successfully!");

    console.log("\n📌 Next Steps\n");

    console.log(`cd ${projectName}`);

    for (const command of step.commands) {
      console.log(command);
    }

    console.log("\n🌐 Open\n");

    console.log(step.url);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\nHappy Coding ❤️");
  } catch (error) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("❌ Failed to create project!");

    console.log("\nReason:");
    console.log(error.message);

    console.log("\nPossible Solutions:\n");

    console.log("• Check your internet connection");
    console.log("• Make sure Composer is installed");
    console.log("• Use another project name");

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }
}

module.exports = {
  init,
};
