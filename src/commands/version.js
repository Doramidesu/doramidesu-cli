const packageInfo = require("../../package.json");

function version() {
  console.log("Doramidesu CLI");
  console.log(`Version ${packageInfo.version}`);
}

module.exports = {
  version,
};
