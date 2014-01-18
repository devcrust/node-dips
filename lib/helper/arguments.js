/*
 * ####################################
 * ##### Dips :: Arguments Helper #####
 * ####################################
 */

/**
 * @namespace Arguments
 */

var exports = module.exports;

/*
 * ++++++++++++++
 * +++ Result +++
 * ++++++++++++++
 */

/**
 * The arguments result class.
 *
 * @memberOf Arguments
 * @constructor
 * @param {Array.<String>} [values]
 */
function ArgumentsResult(values)
{

    /**
     * The arguments.
     *
     * @property args
     * @private
     * @type {Array.<String>}
     */
    this.args = [];

    /*
     * -------------------
     * --- Constructor ---
     * -------------------
     */

    // Set arguments
    this.setArguments(values);

};

/*
 * --------------
 * --- Static ---
 * --------------
 */

/**
 * Checks if the given argument is an dependency injection (DI) argument.
 *
 * @memberOf ArgumentsResult
 * @method isDiArgument
 * @static
 * @param {String} value
 * @returns {Boolean}
 */
ArgumentsResult.isDiArgument = function (value)
{
    return (value.substr(0, 1) === '$' && value.length > 1) ? true : false;
};

/**
 * Check if the given argument is an usual argument.
 *
 * @memberOf ArgumentsResult
 * @method isUsualArgument
 * @static
 * @param {String} value
 * @returns {Boolean}
 */
ArgumentsResult.isUsualArgument = function (value)
{
    return (value.substr(0, 1) !== '$') ? true : false;
};

/*
 * ----------------
 * --- Instance ---
 * ----------------
 */

/**
 * Returns all arguments.
 *
 * @memberOf ArgumentsResult
 * @instance
 * @method getArguments
 * @returns {Array.<String>}
 */
ArgumentsResult.prototype.getArguments = function ()
{
    return this.args;
};

/**
 * Sets the arguments.
 *
 * @memberOf ArgumentsResult
 * @instance
 * @method setArguments
 * @param {Array.<String>} values
 * @returns {ArgumentsResult}
 */
ArgumentsResult.prototype.setArguments = function (values)
{

    // Check values
    if (!Array.isArray(values)) {
        values = [];
    }

    // Set arguments
    this.args = values;

    return this;

};

/**
 * Returns the dependency injection (DI) arguments (starting with "$" - e.g. $Logger, $db, ...).
 *
 * @memberOf ArgumentsResult
 * @instance
 * @method getDiArguments
 * @returns {Array.<String>}
 */
ArgumentsResult.prototype.getDiArguments = function ()
{

    var result;

    // Get DI arguments
    result = this.getArguments().filter(function (value)
    {
        return ArgumentsResult.isDiArgument(value);
    });

    return result;

};

/**
 * Returns the usual arguments.
 *
 * @memberOf ArgumentsResult
 * @instance
 * @method getUsualArguments
 * @returns {Array.<String>}
 */
ArgumentsResult.prototype.getUsualArguments = function ()
{

    var result;

    // Get DI arguments
    result = this.getArguments().filter(function (value)
    {
        return ArgumentsResult.isUsualArgument(value);
    });

    return result;

};

/**
 * Returns the position of the given argument.
 *
 * @memberOf ArgumentsResult
 * @instance
 * @method getArgumentPosition
 * @param {String} value
 * @returns {Integer}
 * @see Array.indexOf
 */
ArgumentsResult.prototype.getArgumentPosition = function (value)
{
    return this.getArguments().indexOf(value);
};

// Export arguments result class
exports.ArgumentsResult = ArgumentsResult;

/*
 * ++++++++++++++
 * +++ Parser +++
 * ++++++++++++++
 */

/**
 * Returns the arguments for the given function.
 *
 * @memberOf Arguments
 * @function parse
 * @param {Function} value the function to parse
 * @returns {ArgumentsResult}
 */
exports.parse = function (value)
{

    var args,
        result = [];

    // Get arguments list
    args = value.toString().match(/function[\s]*\(([\s\S]*?)\)/i);

    // Check args
    if (args && args[1]) {

        // Parse arguments list
        result = args[1].split(',').map(function (value)
        {

            // Remove whitespaces
            return value.trim();

        });

    }

    return new ArgumentsResult(result);

};

/*
 * +++++++++++++++
 * +++ Builder +++
 * +++++++++++++++
 */

/**
 * Builds the arguments list for the given result and parameters.
 *
 * @memberOf Arguments
 * @function build
 * @param {ArgumentsResult} args the arguments result
 * @param {Container} container the dependency injection container
 * @param {Array.<Mixed>} params the original function arguments
 * @returns {Array.<String>}
 */
exports.build = function (args, container, params)
{

    var result = [],
        pos = 0;

    // Check params
    params = params || [];

    /*
     * -------------------
     * --- with Object ---
     * -------------------
     */

    // Check is suitable
    if (params[0] instanceof Object && args.getUsualArguments().length > 1) {

        // List arguments
        args.getArguments().forEach(function (name)
        {

            // Check is DI argument
            if (ArgumentsResult.isDiArgument(name)) {
                result.push(container.invoke(container.getDependency(name.substr(1))));
            } else {
                result.push(params[0][name]);
            }

        });

    }

    /*
     * ----------------------
     * --- with Arguments ---
     * ----------------------
     */

    else {

        // List arguments
        args.getArguments().forEach(function (name)
        {

            // Check is DI argument
            if (ArgumentsResult.isDiArgument(name)) {
                result.push(container.invoke(container.getDependency(name.substr(1))));
            } else {
                result.push(params[pos++]);
            }

        });

    }

    return result;

};