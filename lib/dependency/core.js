/*
 * #####################################
 * ##### Dips :: Core Dependencies #####
 * #####################################
 */

/**
 * @namespace Core_Dependencies
 */

var exports = module.exports,
    util = require('util'),
    lazyLoader = require('../helper/lazy_loader.js');

/*
 * +++++++++++++++
 * +++ Modules +++
 * +++++++++++++++
 */

/**
 * The NodeJS core modules list.
 *
 * @memberOf Core_Dependencies
 * @property modules
 * @type {Array.<String>}
 */
exports.modules = [
    "_debugger", "_linklist", "_stream_duplex", "_stream_passthrough", "_stream_readable", "_stream_transform",
    "_stream_writable", "assert", "buffer", "child_process", "cluster", "console", "constants", "crypto", "dgram",
    "dns", "domain", "events", "freelist", "fs", "http", "https", "module", "net", "os", "path", "punycode",
    "querystring", "readline", "repl", "stream", "string_decoder", "sys", "timers", "tls", "tty", "url", "util", "vm",
    "zlib"
];

/*
 * ++++++++++++++++++++
 * +++ Dependencies +++
 * ++++++++++++++++++++
 */

/**
 * Returns the NodeJS core dependencies.
 *
 * @memberOf Core_Dependencies
 * @function getDependencies
 * @param {String|undefined} [prefix=undefined] the prefix to use e.g. "core" for "core.path" or no prefix for "path"
 * @returns {Object.<String, *>}
 */
exports.getDependencies = function (prefix)
{

    var result = exports.modules;

    // Check prefix
    if (prefix) {

        // Reset result
        result = {};

        // List modules
        exports.modules.forEach(function (id)
        {

            // Add to result
            result[util.format('%s_%s', prefix, id)] = id;

        });

    }

    return lazyLoader(result);

};
