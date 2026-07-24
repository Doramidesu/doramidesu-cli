const { execSync } = require("child_process");

function checkCommand(command, label) {
  try {
    const version = execSync(command, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    return {
      installed: true,
      version,
    };
  } catch {
    return {
      installed: false,
      version: null,
    };
  }
}

module.exports = {
  checkCommand,
};
