# gift-cli
 
A tiny cli that passes a tokenized command line to a command processor class.

## exported methods

This module exports four methods.

```
// These are the main methoods that will be required
// to run the cli application.

module.exports.load_config_file
module.exports.run_commands

// These helper methods can be used
// to make it easy to get parts of the command line

module.exports.front_tokens = front_tokens;
module.exports.rest_tokens = rest_tokens;

```

`load_config_file` takes one parameter, a file name. The file should be a JSON formatted file. The resultant javascript object will be passed as config to the `run_commands` method.

Here is a call to `run_commands`:

`run_commands(cmds,conf,process.stdin,process.stdout)`

Notice process.stdin and process.stdout will be reading from the users console what the user has typed.

The `cmds` parameter will be a reference to a class instance of a command processor. The class must implement two methods:

* `try_getting_conf`
* `process_command`

Here is an example of such a class:

```
class CMDS {
    constructor() {}
    try_getting_conf(tokens) { 
    	let fname = its_in_the(tokens)
    	let some_conf_file_object = JSON.parse(fs.readFileSync(fname).toString())
    	return some_conf_file_object or false 
    }
    process_command(tokens,config) {
        let cmd = its_in_the(tokens)
        switch (cmd) {
        	case "one_cmd" : { do_it(); break; }
        	case "etc" : ...
        	default : break; // no such command
        }
    }
}
```

Of course, your class can do more. 



## usage


The main method `run_commands` relies on a tokenizer `js-tokens` to turn a command line into tokens.
The methods `run_commands` passes the tokens to a class provided by the application. The tokenizer for `run_commands` keeps clumps together and ignores white space. `js-tokens` keeps strings together, making it very useful.

By 'keeping clumps together' is meant that string things with punctuation within them and no spaces will be regarded as a single thing, not several.

So, `./dir/file.ext` will be a single file path equivalent to one token.


Here is the test program found in the test directory:

```
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

```


Notice that in the test, the input stream is a Readable derived from a string of commands. Two lines are provided. The last line commands `exit`, the only command processed by the run commands outside of the class.


## helper methods

* `front_tokens`
* `rest_token`

These two methods are basically extended slice methods.

### `front_tokens`

> given the result of a method `tokenize`, used internally to the library, this will return a slice of values as a space delimited string.
> 
> Parameters

* tokens -- the syntactic token list returned by `tokenize`
* start -- same as `start` in slice
* count -- same as `count` in slice

> 
> **For example:**  *(This example is from [bash-xpos](https://github.com/copious-world/bash-xops) source code.)*

```
const {load_config_file,front_tokens,rest_tokens} = require('gift-cli')

...

case 'mkdir' : {
    let remote_dir = front_tokens(tokens,1,1)
    let known_host = front_tokens(tokens,2,1)
    console.log(`mkdir will create a directory tree for ${remote_dir}`)
    let b64pass = Buffer.from(conf.pass).toString('base64')
    await xops.expect_ensure_dir(b64pass,conf.user,conf.IP,remote_dir,known_host)
    break
}
```


### `rest_token`
> given the result of a method `tokenize`, used internally to the library, this will return a slice of values as a space delimited string starting at `start` and continuing to the end of the token list.
> 
> Parameters

* tokens -- the syntactic token list returned by `tokenize`
* start -- same as `start` in slice

> **For example:**  *(This example is from [bash-xpos](https://github.com/copious-world/bash-xops) source code.)*

```
const {load_config_file,front_tokens,rest_tokens} = require('gift-cli')

...


case 'xbash' : {
    let b64pass = Buffer.from(conf.pass).toString('base64')
    let bash_op = front_tokens(tokens,1,1)
    let params = rest_tokens(tokens,2)
    await xops.perform_expect_op(b64pass,onf.user,conf.IP, bash_op, params)
    break;
}

```
