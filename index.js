#! /usr/bin/env node

const { program } = require("commander");
const coflow = require("./commands/coflow");

program.command("parse").description("Create a nice documentation of your processes").action(coflow);

program.parse();
