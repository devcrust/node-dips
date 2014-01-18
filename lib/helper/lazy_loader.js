/*
 * ######################################
 * ##### Dips :: Lazy Loader Helper #####
 * ######################################
 */

/**
 * @namespace Lazy_Loader
 */

/**
 * Returns the lazy loader for the given values.
 *
 * @memberOf Lazy_Loader
 * @param {Array.<String>|Object.<String,String>} values the values to use, name as key and id as value (@see module.require) if object is used
 * @param {Object.<String, *>} [result={}] the result object to use
 * @returns {Object.<String, *>}
 * @see module.require
 */
module.exports = function (values, result)
{

    var keys;

    // Set keys
    keys = (!Array.isArray(values)) ? Object.keys(values) : values;

    // Set values
    values = (!Array.isArray(values)) ? Object.keys(values).map(function (key)
    {

        return values[key];

    }) : values;

    // Check result
    result = result || {};

    // List values
    values.forEach(function (value, index)
    {

        var key;

        // Set key
        key = keys[index];

        // Add to result
        Object.defineProperty(result, key, {

            configurable : true,
            enumerable   : true,

            get : function ()
            {
                return require(value);
            }

        });

    });

    return result;

};