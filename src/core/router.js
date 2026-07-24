const { showBanner } = require("../ui/banner");
const { commands } = require("./commands");

function route(command, framework, projectName) {
  if (!command) {
    showBanner();
    return;
  }

  const selectedCommand = commands[command];

  if (selectedCommand) {
    selectedCommand.action(framework, projectName);
    return;
  }

  console.log(`Unknown command: ${command}`);

  console.log("\nAvailable Commands:\n");

  for (const commandName in commands) {
    console.log(commandName);
  }
}

module.exports = {
  route,
};
