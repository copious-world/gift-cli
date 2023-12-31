

const {tokenize} = require('./line_tokens')
const readline = require('node:readline');


/**
 * @callback CommandProcessor
 * @param {object[]} tokens -- The result of calling `tokenize`
 * @param {object} conf -- the configuration file loaded by the application
 */

/**
 * @callback ConfigLoader
 * @param {object[]} tokens -- The result of calling `tokenize`
 * @returns {object|boolean} -- If successful, returns the configuration file, otherwise returns false.
 */


/**
 * @typedef Commands
 * @type {object}
 * @property {CommandProcessor} process_command - type names returned by js-tokens.
 * @property {ConfigLoader} try_getting_conf - an island of characters seen in an input string to the parser.
 */



/**
 * This is a command loop that reads in commands, line by line from an input stream.
 * Each command line is tokenized, and the tokens are passed to the `process_commands` method of the cmd object.
 * 
 * @param {Commands} cmds 
 * @param {object} config -- the fields of this file are deterined by the application
 * @param {stream} instream -- a node.js input stream
 * @param {stream} outstream -- a node.js output stream
 */
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
