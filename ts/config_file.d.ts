/**
 * Attempts to load the JSON formatted configuration file, parse it and return it.
 * If it can't load the file, it will report an error message and return false
 * The error message is custom for use in the cli. It expects users will provide `load conf` as a command.
 * Except for JSON formatting, the configuration object will be determined by the application.
 *
 * @param {string} conf_file -- the name of a configuration file that is hopefully on disk
 * @returns {object | boolean}  -- if a boolean is returned, it will be false.  The object will be the configuration object.
 */
declare function load_config_file(conf_file: string): false | Object;
export { load_config_file };
