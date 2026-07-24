#!/usr/bin/env node
const { route } = require("./core/router");

const command = process.argv[2];
const framework = process.argv[3];
const projectName = process.argv[4];

route(command, framework, projectName);
