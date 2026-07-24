function showBanner() {
  console.log(`
==================================================
                  Doramidesu CLI
          Build Your Future with Confidence
==================================================

Version : v0.1.0

Available Commands

init         Initialize a new project
doctor       Check development environment
help         Show all available commands
version      Show CLI version
about        About Doramidesu

==================================================
Documentation:
https://github.com/Doramidesu/doramidesu-cli
`);
}

module.exports = {
  showBanner,
};
