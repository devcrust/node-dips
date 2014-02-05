/*
 * ####################################
 * ##### Dips :: NPM Dependencies #####
 * ####################################
 */

/**
 * @namespace NPM_Dependencies
 */

var exports = module.exports,
    lazyLoader = require('../helper/lazy_loader.js'),
    util = require('util'),
    fs = require('fs');

/*
 * ++++++++++++++
 * +++ Ignore +++
 * ++++++++++++++
 */

/**
 * The ignore list.
 *
 * @memberOf NPM_Dependencies
 * @property ignore
 * @type {Array.<String|RegExp>}
 */
exports.ignore = ['.bin', '.gitignore'];

/*
 * +++++++++++++++
 * +++ Modules +++
 * +++++++++++++++
 */

/**
 * The NPM modules list.
 *
 * @memberOf NPM_Dependencies
 * @property modules
 * @type {Array.<String>}
 */
exports.modules = (function ()
{

    var result = [],
        dirs;

    /*
     * -----------------------
     * --- NPM Directories ---
     * -----------------------
     */

    // Set NPM directories
    dirs = require.main.paths.filter(function (value)
    {

        // Check ends with "node_modules"
        if (value.substr(-13) !== '/node_modules') {
            return false;
        }

        // Check sub "node_modules" folder
        if (value.match(/node_modules/g).length !== 1) {
            return false;
        }

        return true;

    });

    // Remove duplicated NPM directories
    dirs = dirs.filter(function (value, pos)
    {
        return (dirs.indexOf(value) === pos) ? true : false;
    });

    /*
     * -------------------
     * --- NPM Modules ---
     * -------------------
     */

    // List NPM directories
    dirs.forEach(function (dir)
    {

        // Check directory exists
        if (!fs.existsSync(dir)) {
            return;
        }

        // List NPM directory files
        fs.readdirSync(dir).forEach(function (value)
        {

            // Add to result
            result.push(value);

        });

    });

    // Remove duplicated NPM modules
    result = result.filter(function (value, pos)
    {
        return (result.indexOf(value) === pos) ? true : false;
    });

    return result;

})();

/*
 * ++++++++++++++++++++
 * +++ Dependencies +++
 * ++++++++++++++++++++
 */

/**
 * Returns the NPM dependencies.
 *
 * @memberOf NPM_Dependencies
 * @function getDependencies
 * @param {String|undefined} [prefix] the prefix to use e.g. "core" for "core.path" or no prefix for "path"
 * @param {Array.<String|RegExp>} [ignore] adds the NPM packages to ignore, defaults to ".bin" and ".gitignore" (@see exports.ignore)
 * @returns {Object.<String, *>}
 */
exports.getDependencies = function (prefix, ignore)
{

    var result = exports.modules;

    // Check ignore
    ignore = (ignore) ? exports.ignore.concat(ignore) : exports.ignore;

    /*
     * --------------
     * --- Ignore ---
     * --------------
     */

    // List ignores
    ignore.forEach(function (value)
    {

        // Filter result
        result = result.filter(function (module)
        {

            var skip;

            /*
             * String
             */

            // Check ignore string
            if (typeof value === 'string') {
                skip = (module === value) ? true : false;
            }

            /*
             * Regex
             */

            // Check ignore regex
            else if (value instanceof RegExp) {
                skip = value.test(module);
            }

            return !skip;


        });

    });

    /*
     * --------------
     * --- Prefix ---
     * --------------
     */

    // Check prefix
    if (prefix) {

        // Set result
        result = (function (values)
        {

            var result = {};

            values.forEach(function (id)
            {

                // Add to result
                result[util.format('%s_%s', prefix, id)] = id;

            });

            return result;

        })(result);

    }

    return lazyLoader(result);

};
