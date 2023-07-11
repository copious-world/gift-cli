import { readFileSync } from 'node:fs';
/**
 * Attempts to load the JSON formatted configuration file, parse it and return it.
 * If it can't load the file, it will report an error message and return false
 * The error message is custom for use in the cli. It expects users will provide `load conf` as a command.
 * Except for JSON formatting, the configuration object will be determined by the application.
 *
 * @param {string} conf_file -- the name of a configuration file that is hopefully on disk
 * @returns {object | boolean}  -- if a boolean is returned, it will be false.  The object will be the configuration object.
 */
function load_config_file(conf_file) {
    console.log("CONFIG FILE: ", conf_file);
    let config = false;
    try {
        let confbuf = readFileSync(conf_file);
        let confstr = confbuf.toString();
        config = JSON.parse(confstr);
    }
    catch (e) {
        if (conf_file === "test/host.conf") {
            console.log("no default config found -- use 'load conf <file path>' to load a configuration.");
        }
        else {
            console.log(`The configuration file ${conf_file} could not be processed`);
            console.log("check that the file exists or check that the file has correct JSON format");
        }
    }
    return config;
}
export { load_config_file };
//module.exports.load_config_file  = load_config_file
