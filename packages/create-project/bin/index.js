#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const program = new Command();
const pkg = require('../package.json');
const { create } = require('../scripts/create');
const { download } = require('../scripts/download');
const { transform } = require('../scripts/transform');
const { publish } = require('../scripts/publish');
const chalk = require('chalk');

program.version(pkg.version, '-v, --version');

// 直接使用脚手架创建项目
program.action(() => {
  create();
});

// 使用脚手架创建项目时传入项目名称
program.command('init [project-name]').action((projectName) => {
  if (!projectName) {
    console.log(chalk.red(`Error: 请输入项目名称`));
    process.exit(1);
  }
  create(projectName);
});

// 使用模版创建项目
// prefix: package.json-name名称前缀
program
  .command('download <template-name> [project-name] [prefix]')
  .option('-r, --replace-content [replace-content...]', 'replace content')
  .action((templateName, projectName, prefix, options) => {
    if (!templateName) {
      console.log(chalk.red(`Error: 请输入模版名称`));
      process.exit(1);
    }
    // projectName可选的
    download(templateName, projectName, prefix, options);
  });

// 转换成模版项目
program
  .command('transform <project-name> [project-path]')
  .option('-l, --lerna', 'use lerna construct')
  .action((projectName, projectPath, options) => {
    if (!projectName) {
      console.log(chalk.red(`Error: 请输入模版名称`));
      process.exit(1);
    }
    // 将项目转换成模版
    transform(projectName, projectPath, options);
  });

// 将当前项目直接发布成npm模版
program
  .command('publish')
  .option('-d, --delete-scripts [delete-scripts...]', 'delete scripts')
  .action((options) => {
    // 将当前项目直接发布成npm模版
    publish(options);
  });

program.parse(process.argv);
