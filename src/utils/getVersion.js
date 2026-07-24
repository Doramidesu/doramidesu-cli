const { execSync } = require("child_process");

function getVersion(config) {
  try {
    let output = execSync(config.command, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    if (config.trim) {
      output = output.replace(config.trim, "");
    }

    if (config.pattern) {
      const match = output.match(config.pattern);

      if (match) {
        output = match[0];
      }
    }

    return output;
  } catch {
    return null;
  }
}

module.exports = {
  getVersion,
};
