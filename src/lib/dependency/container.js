/*
 * ########################################
 * ##### Dips :: Dependency Container #####
 * ########################################
 */

var Arguments = require('../helper/arguments.js');

/**
 * The dependency container class.
 *
 * @constructor
 * @param {Object} [values]
 */
function Container(values)
{

    /**
     * The dependencies.
     *
     * @memberOf Container
     * @instance
     * @property dependencies
     * @private
     * @type {Object.<String, *>}
     */
    this.dependencies = {};

    /*
     * -------------------
     * --- Constructor ---
     * -------------------
     */

    // Set dependencies
    this.setDependencies(values || {});

};

/*
 * ++++++++++++++
 * +++ Static +++
 * ++++++++++++++
 */

/**
 * Converts the given dependency id.
 * Allows to use dependency names starting with "$" and without.
 *
 * @memberOf Container
 * @static
 * @method convertId
 * @param {String} value
 * @returns {String}
 */
Container.convertId = function (value)
{

    // Check id
    if (value.substr(0, 1) === '$') {
        return value.substr(1);
    }

    return value;

};

/* ++++++++++++++++
 * +++ Instance +++
 * ++++++++++++++++
 */

/**
 * Returns the ids of the registered dependencies.
 *
 * @memberOf Container
 * @instance
 * @method getDependencies
 * @returns {Array.<String>}
 */
Container.prototype.getDependencies = function ()
{
    return Object.keys(this.dependencies);
};

/**
 * Sets the dependencies.
 *
 * @memberOf Container
 * @instance
 * @method setDependencies
 * @param {Object.<String, *>} values
 * @returns {Container}
 */
Container.prototype.setDependencies = function (values)
{

    // Set dependencies
    this.dependencies = values;

    return this;

};

/**
 * Adds the given dependencies.
 *
 * @memberOf Container
 * @instance
 * @method addDependencies
 * @param {Object.<String, *>} values
 * @returns {Container}
 */
Container.prototype.addDependencies = function (values)
{

    var self = this;

    // List values
    Object.keys(values).forEach(function (id)
    {

        // Add dependency
        self.setDependency(id, values[id]);

    });

    return this;

};

/**
 * Checks if the dependency with the given id does exist.
 *
 * @memberOf Container
 * @instance
 * @method hasDependency
 * @param {String} id
 * @returns {Boolean}
 */
Container.prototype.hasDependency = function (id)
{
    return (this.dependencies.hasOwnProperty(Container.convertId(id))) ? true : false;
};

/**
 * Returns the dependency with the given id.
 *
 * @memberOf Container
 * @instance
 * @method getDependency
 * @param {String} id
 * @returns {*}
 */
Container.prototype.getDependency = function (id)
{
    return this.dependencies[Container.convertId(id)];
};

/**
 * Sets the dependency with the given id.
 *
 * @memberOf Container
 * @instance
 * @method setDependency
 * @param {String} id the dependency id
 * @param {*} value the dependency value
 * @returns {Container}
 */
Container.prototype.setDependency = function (id, value)
{

    // Set dependency
    this.dependencies[Container.convertId(id)] = value;

    return this;

};

/**
 * Invokes the given function, array or object.
 *
 * @memberOf Container
 * @instance
 * @method invoke
 * @param {Function|Array|Object|*} value
 * @returns {*}
 */
Container.prototype.invoke = function (value)
{

    /*
     * ----------------
     * --- Function ---
     * ----------------
     */

    // Check is function
    if (value instanceof Function) {

        return (function (self, arguments)
        {

            var args,
                params;

            /*
             * Arguments
             */

            // Set arguments
            args = (function (values)
            {

                var result = [];

                // List values
                Object.keys(values).forEach(function (value)
                {

                    // Add to result
                    result.push(values[value]);

                });

                return result;

            })(arguments).slice(1);

            /*
             * Parameters
             */

            // Set parameters
            params = Arguments.build(Arguments.parse(value), self, args);

            return value.apply(value, params);

        })(this, arguments);
    }

    /*
     * -------------
     * --- Array ---
     * -------------
     */

    // Check is array
    else if (Array.isArray(value)) {

        return (function (self)
        {

            return value.map(function (value)
            {

                // Check is DI argument
                if (Arguments.ArgumentsResult.isDiArgument(value)) {
                    return self.getDependency(value);
                }

                return value;

            });

        })(this);

    }

    /*
     * --------------
     * --- Object ---
     * --------------
     */

    // Check is object
    else if (value instanceof Object) {

        return (function (self)
        {

            // List keys
            Object.keys(value).forEach(function (key)
            {

                // Check is DI argument
                if (Arguments.ArgumentsResult.isDiArgument(key)) {

                    // Set value
                    value[key] = self.getDependency(key);

                }

            });

            return value;

        })(this);

    }

    /*
     * -------------
     * --- Other ---
     * -------------
     */

    // Check is other
    else {
        return value;
    }

};

/*
 * ###################
 * ##### Exports #####
 * ###################
 */

module.exports = Container;