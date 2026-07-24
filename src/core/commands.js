const { about } = require("../commands/about");
const { help } = require("../commands/help");
const { version } = require("../commands/version");
const { doctor } = require("../commands/doctor");
const { init } = require("../commands/init");

const commands = {
  about: {
    action: about,
    description: "Show information",
  },

  doctor: {
    action: doctor,
    description: "Check environment",
  },

  help: {
    action: help,
    description: "Show available commands",
  },
  version: {
    action: version,
    description: "Show CLI version",
  },
  init: {
    action: init,
    description: "Initialize a new project",
  },
};

module.exports = {
  commands,
};
