

const {tokenize} = require('./line_tokens')
const readline = require('node:readline');



async function run_commands(cmds,config,instream,outstream) {
    //
    const rl = readline.createInterface({
      input: instream,
      output: outstream,
      prompt: '$> ',
    });
    
    rl.prompt();
    
    rl.on('line', (line) => {
        let ll = line.trim()
        switch (ll) {
            case 'exit':
                rl.close()
                break;
            default:
                let tokens = tokenize(ll)
                if ( config === false ) {
                    config = cmds.try_getting_conf(tokens)
                    if ( !config ) {
                        console.log("the configuration file has not been loaded... load a configuration with 'load conf'")
                    }
                } else {
                    cmds.process_command(tokens,config)
                }
                //
                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });
    //
}



module.exports.run_commands = run_commands
