const { checkCommand } = require("../utils/checkCommand");
const { getVersion } = require("../utils/getVersion");
const { requirements } = require("../config/requirements");

function doctor() {
  console.log("====================================");
  console.log("      Doramidesu Doctor");
  console.log("====================================\n");

  let installed = 0;

  for (const item of requirements) {
    const result = checkCommand(item.check);

    if (!result.installed) {
      console.log(`✗ ${item.label.padEnd(10)} : Not Found`);
      console.log(`  → Install: ${item.install}\n`);
      continue;
    }

    const version = getVersion(item.version);

    installed++;

    console.log(`✓ ${item.label.padEnd(10)} : ${version}`);
  }

  console.log("\n------------------------------------");
  console.log("Environment Summary\n");

  console.log(`Installed : ${installed}/${requirements.length}\n`);

  if (installed === requirements.length) {
    console.log("✓ Your environment is ready.");
  } else {
    console.log("✗ Please install the missing requirements.");
  }
}

module.exports = {
  doctor,
};
