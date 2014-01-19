/*
 * #################################
 * ##### Dips :: File Entities #####
 * #################################
 */

/**
 * @namespace File_Entities
 */

var exports = module.exports,
    util = require('util'),
    Path = require('path'),
    fs = require('fs');

/*
 * +++++++++++++++
 * +++ Scanner +++
 * +++++++++++++++
 */

/**
 * The file extension order.
 * Used to prioritise multiple equal named files (basename).
 *
 * @memberOf File_Entities
 * @property extensionOrder
 * @type {Array.<String>}
 */
exports.extensionOrder = (function ()
{

    var result = ['js', 'node', 'json'];

    // Add require extensions
    result = result.concat(

        Object.keys(require.extensions)

            .map(function (value)
            {
                return value.substr(1);
            })

    );

    // Remove duplicated
    result = result.filter(function (value, pos)
    {
        return (result.indexOf(value) === pos) ? true : false;
    });

    return result;

})();

/**
 * Scans the given path.
 *
 * @memberOf File_Entities
 * @function scan
 * @param {String} path the path to use
 * @param {Object.<String, *>} [result={}] the result to use
 * @returns {Object.<String, *>}
 */
exports.scan = function scan(path, result)
{

    var entities;

    // Check result
    result = result || {};

    // Set entities
    entities = fs.readdirSync(path);

    // List directory entities
    entities.forEach(function (value)
    {

        var entity = Path.basename(value, Path.extname(value)),
            entityPath = Path.join(path, entity);

        // Check already registered
        if (result.hasOwnProperty(entity)) {
            return;
        }

        // Define lazy loader
        Object.defineProperty(result, entity, {

            configurable : false,
            enumerable   : true,

            get : (function ()
            {

                var result = {},
                    files;

                /*
                 * ++++++++++++
                 * +++ File +++
                 * ++++++++++++
                 */

                // Get files
                files = entities.filter(function (value)
                {

                    var parts;

                    // Get file parts
                    parts = value.match(/^(.*)(\..*)/i);

                    // Check parts
                    if (!parts) {
                        return false;
                    }

                    // Check basename
                    if (parts[1] !== entity) {
                        return false;
                    }

                    // Check extensions
                    if (Object.keys(require.extensions).indexOf(parts[2]) === -1) {
                        return false;
                    }

                    return true;

                });

                // Sort files
                files = files.sort(function (a, b)
                {

                    var aExt = Path.extname(a).substr(1),
                        bExt = Path.extname(b).substr(1);

                    // Check priority of a
                    if (exports.extensionOrder.indexOf(aExt) < exports.extensionOrder.indexOf(bExt)) {
                        return -1;
                    }

                    // Check priority of b
                    else if (exports.extensionOrder.indexOf(bExt) < exports.extensionOrder.indexOf(aExt)) {
                        return 1;
                    }

                    return 0;

                });

                // Check files
                if (files.length > 0) {

                    // Register first file
                    result = require(Path.join(path, files.shift()));

                    // Check result
                    if (!result instanceof Object) {
                        throw new Error(util.format('Entity "%s" in directory "%s" is not a valid object!', entity,
                            file));
                    }

                }

                // Define DI container
                result.$ = {};

                // List remaining files
                files.forEach(function (value)
                {

                    // Define lazy loader
                    Object.defineProperty(result.$, value, {

                        configurable : false,
                        enumerable   : true,

                        get : (function ()
                        {
                            return require(Path.join(path, value));
                        })

                    });

                });

                /*
                 * ++++++++++++++
                 * +++ Folder +++
                 * ++++++++++++++
                 */

                // Check is directory
                if (entities.indexOf(entity) !== -1 && fs.statSync(entityPath).isDirectory()) {
                    scan(entityPath, result);
                }

                return result;

            })

        });

    });

    return result;

};

/*
 * ++++++++++++++++
 * +++ Entities +++
 * ++++++++++++++++
 */

/**
 * Returns the file entities for the given paths.
 *
 * @memberOf File_Entities
 * @function getEntities
 * @param {String|Array.<String>|Object.<String,String>} paths the paths to parse, entity id as key and folder path as value if object is used
 * @param {String} [basePath=""] the absolute base path to use, if folders content uses relative paths
 * @param {String|undefined} [prefix=undefined] the prefix to use e.g. "view" for "my.view" or no prefix for "view"
 * @returns {Object.<String, *>}
 */
exports.getEntities = function (paths, basePath, prefix)
{

    var result = {};

    // Check base path
    basePath = basePath || '';

    /*
     * -------------
     * --- Paths ---
     * -------------
     */

    // Set paths
    paths = (typeof paths === 'string') ? [paths] : paths;

    // Check paths is array
    if (Array.isArray(paths)) {

        // Map paths
        paths = (function ()
        {

            var result = {};

            // List paths
            paths.forEach(function (value)
            {

                // Add to result
                result[Path.basename(value)] = value;

            });

            return result;

        })();

    }

    /*
     * ---------------
     * --- Process ---
     * ---------------
     */

    // List paths
    Object.keys(paths).forEach(function (value)
    {

        var id = value;

        // Check prefix
        if (prefix) {
            id = util.format('%s_%s', prefix, id);
        }

        // Add to result
        result[id] = exports.scan(Path.join(basePath, paths[value]));

    });

    return result;

};
