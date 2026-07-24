const requirements = [
  {
    id: "php",
    label: "PHP",
    check: "php -v",

    version: {
      command: 'php -r "echo PHP_VERSION;"',
    },

    install: "https://www.php.net/downloads.php",
  },

  {
    id: "composer",
    label: "Composer",
    check: "composer --version",

    version: {
      command: "composer --version",
      pattern: /\d+\.\d+\.\d+/,
    },

    install: "https://getcomposer.org/download/",
  },

  {
    id: "node",
    label: "Node.js",
    check: "node -v",

    version: {
      command: "node -v",
      trim: "v",
    },

    install: "https://nodejs.org/",
  },

  {
    id: "npm",
    label: "npm",
    check: "npm -v",

    version: {
      command: "npm -v",
    },

    install: "https://nodejs.org/",
  },
];

module.exports = {
  requirements,
};
