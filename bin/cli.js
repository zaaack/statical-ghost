var program = require('commander')

program
  .version(require('../package.json').version)
  .option('-c, --config <path>', 'set config path. defaults to ./config.yaml')
  .action(function(cmd, config) {
    global.configFile = config
    console.log(1, global.configFile);
  })

program
  .command('generate')
  .description('generate blog')
  .alias('g')
  .action(function(){
    setCliConfig()
    require('./cli-generate')
  })

program.command('init [m]')
  .description('initialize blog structure in current directory')
  .action(function(){
    setCliConfig()
    require('./cli-init')
  })


program.parse(process.argv);

function setCliConfig(){
  global.cliConfig = program
}

module.exports = program
