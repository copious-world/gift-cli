

const fs = require('fs')

function load_config_file(conf_file) {
    console.log("CONFIG FILE: ",conf_file)
    let config = false
    try {
        let confstr = fs.readFileSync(conf_file)
        confstr = confstr.toString()
        config = JSON.parse(confstr)
    } catch(e) {
        if ( conf_file === "test/host.conf" ) {
            console.log("no default config found -- use 'load conf <file path>' to load a configuration.")
        } else {
            console.log(`The configuration file ${conf_file} could not be processed`)
            console.log("check that the file exists or check that the file has correct JSON format")
        }
    }
    return config
}



module.exports.load_config_file  = load_config_file

