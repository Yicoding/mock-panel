'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chalk = require('chalk');
const { exec } = require('shelljs');

const {
  ensureDir,
  inputProjectPath,
  filterFuncAddPkg,
  filterFunc,
  createIgnoreFile,
} = require('../utils/tools');
const { tryGitInit, tryGitCommit } = require('../utils/git');
const { REGISTRY_XNPM } = require('../utils/constants');

async function transform(projectName, projectPath, options) {
  const { lerna } = options;

  // 待转换项目的根路径
  const currentProjectPath = process.cwd();
  // const currentProjectPath = path.resolve();
  // 先判断是否有package.json，保证是在项目根目录下
  const pkgFileName = 'package.json';
  const tmpFileName = 'template.json';
  if (!fs.existsSync(`${currentProjectPath}/${pkgFileName}`)) {
    console.log(
      chalk.red(`没有检测到${pkgFileName}，请检查当前目录是否为项目的根目录`),
    );
    process.exit(1);
  }

  if (!projectPath) {
    const answer = await inputProjectPath();
    projectPath = answer.projectPath;
  }

  // 处理项目路径
  if (projectPath[projectPath.length === '/']) {
    projectPath = projectPath.slice(0, -1);
  }

  projectName = projectName.replace(/@xmly\//, '').replace(/@xmc\//, '');

  // 项目存放目录
  const targetPath = `${projectPath}/${projectName}`;
  // 项目template目录
  const packagesDir = lerna
    ? `${targetPath}/packages/${projectName}`
    : `${targetPath}`;
  const templateDir = `${packagesDir}/template`;

  // 创建目录
  ensureDir(targetPath);
  ensureDir(templateDir);

  // 复制当前目录文件到模版目录
  fs.copySync(currentProjectPath, templateDir, {
    filter: filterFuncAddPkg,
  });

  // 待复制目录
  const originProjectDir = path.join(__dirname, '..', 'project');
  const originTemplate = `${originProjectDir}/${lerna ? 'lerna' : 'template'}`;
  const originCommon = `${originProjectDir}/common`;

  // 复制origin目录
  fs.copySync(originTemplate, targetPath, {
    filter: filterFunc,
  });
  // 复制common目录
  fs.copySync(originCommon, targetPath, {
    filter: filterFunc,
  });

  // 创建.gitignore
  createIgnoreFile(targetPath, 'gitignore', '.gitignore');

  // 改写.gitignore文件
  createIgnoreFile(templateDir, '.gitignore', 'gitignore');

  // 创建template.json
  // 读取package.json
  const { name, version, ...originPkgJson } = fs.readJsonSync(
    `${currentProjectPath}/${pkgFileName}`,
  );

  const templateJson = {
    package: originPkgJson,
  };

  fs.writeFileSync(
    path.join(packagesDir, tmpFileName),
    JSON.stringify(templateJson, null, 2) + os.EOL,
  );

  // 创建package.json，发布npm需要用
  const userNameXnpm = exec(`npm whoami --registry=${REGISTRY_XNPM}`, {
    silent: true,
  }).stdout.trim();

  let localPkgJson = {};
  if (fs.existsSync(`${targetPath}/${pkgFileName}`)) {
    localPkgJson = fs.readJsonSync(`${targetPath}/${pkgFileName}`);
  }

  const pkgJson = {
    name: `@xmly/${projectName}`,
    version: '1.0.0',
    keywords: [],
    description: '',
    author: userNameXnpm,
    maintainers: [userNameXnpm],
    main: tmpFileName,
    license: 'MIT',
    files: ['template', tmpFileName],
    ...localPkgJson,
  };

  fs.writeFileSync(
    path.join(packagesDir, pkgFileName),
    JSON.stringify(pkgJson, null, 2) + os.EOL,
  );

  // 创建README.md
  fs.writeFileSync(
    path.join(packagesDir, 'README.md'),
    'This is a simple description',
  );

  // 切换进程到模版目录
  process.chdir(targetPath);

  // git init
  let initializedGit = false;
  if (tryGitInit()) {
    initializedGit = true;
    console.log('\nInitialized a git repository.\n');
  }

  // git commit
  if (initializedGit && tryGitCommit(targetPath)) {
    console.log('\nCreated git commit.');
  }

  console.log(
    `\nSuccess! Created ${chalk.greenBright(projectName)} at ${chalk.green(
      targetPath,
    )}\n`,
  );
  console.log(`  项目已成功转换成模版，快去查看吧`);
  console.log();
  console.log(chalk.cyan('  执行yarn'));
  console.log('    先安装项目依赖.');
  console.log();
  console.log(chalk.cyan('  执行yarn pub'));
  console.log('    可以将模版发布到npm中.');
  console.log();
  console.log();
}

module.exports = {
  transform,
};
