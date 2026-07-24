const packageInfo = require("../../package.json");

function about() {
  console.log("====================================");
  console.log("        Doramidesu CLI");
  console.log("====================================\n");

  console.log(`Version     : ${packageInfo.version}`);
  console.log(`Author      : ${packageInfo.author}`);
  console.log(`Description : ${packageInfo.description}`);
  console.log(`License     : ${packageInfo.license}`);
}

module.exports = {
  about,
};
