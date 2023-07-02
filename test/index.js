
const {tokenize} = require('../lib/line_tokens')
const {load_config_file} = require('../lib/config_file')
const {run_commands} = require('../lib/cl_app')



function it_tokenizes_clumpy_line() {
    let tokens = tokenize('this is a ./test/of things.in.general yes')
    console.assert(tokens[3].type === 'ClumpedTokens')
    console.assert(tokens[3].value === './test/of')
    console.assert(tokens[4].value === 'things.in.general')
}


class NoCMDS {
    constructor() {}
    try_getting_conf(tokens) { return false }
    process_command(tokens,config) {
        console.log(tokens)
    }
}

async function run_tests()  {
    // 
    console.log('it_tokenizes_clumpy_line')
    it_tokenizes_clumpy_line()

    let conf = load_config_file('junky')
    console.assert(conf === false)

    conf = load_config_file('./test/test.conf')
    console.assert(conf.not === 'much')

    console.log('type exit')
    let cmds = new NoCMDS()
    const { Readable } = require("stream")
    const readable = Readable.from(["try this first \nexit"])

    run_commands(cmds,conf,readable,process.stdout)

}




run_tests()