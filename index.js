#!/usr/bin/env node

const { program } = require('commander')
const {chooseTemplate} = require('./inquirers')
const download = require('download-git-repo')
const templateMap = require('./templateMap')
const ora = require('ora')
const chalk = require('chalk')

function start() {
  console.log(chalk.rgb(216, 27, 96)('\n 😈😈😈  你好啊, 靓仔~~'))
  console.log(chalk.cyanBright(' 🦄🦄🦄  靓仔正在使用zengzhe-cli命令行工具...\n'))

  program.version(require('./package.json').version)
   program
    .command('create <projectName>')
    .description('用于创建一个项目模板')
    .option("-T, --template [template]", "输入使用的模板名字")
    .action(async function(projectName, options){
      let template = options.template;
      projectName = projectName || 'untitled';

      if(!template){
          template = await chooseTemplate() // 注意这里是一个异步方法
      }

      console.log(chalk.rgb(69, 39, 160)('你选择的模板是 👉'),chalk.bgRgb(69, 39, 160)(template))

      // 下载前提示loading
      const spinner = ora({
          text: '正在下载模板...',
          color: "yellow",
          spinner: {
              interval: 80,
              frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
          },
      });
      spinner.start();

      const downloadUrl = templateMap.get(template) // templateMap是一个引入的自定义Map

      download(downloadUrl, projectName,{clone: true} , error => {
        if(error){
          spinner.fail(`下载失败 😭😭😭`)
          console.log(chalk.bgRgb(220,0,8)(`  创建项目失败：${projectName} `),'😭😭😭')
          console.log('🧐🧐🧐 失败原因：',chalk.bgRgb(220,0,8)(error.message))
        }else {
          spinner.succeed(`下载完成：${projectName}`)
          console.log('✌✌✌',chalk.rgb(69, 39, 160)('成功创建项目  👉  '),chalk.bgRgb(69, 39, 160)(projectName))
        }
      })

    });
  program
    .command('checkAll')
    .description('查看所有的模板')
    .action(function(){
      const templateList = [
        'vue-vant-template',
        'vue-vant-template-ts'
      ]
      templateList.forEach((temp,index) => {
        console.log(chalk.rgb(69, 39, 160)(`(${index+1})  ${temp}`))
      })
    })

  program.parse(process.argv);

}
start()