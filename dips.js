/*
 * ################
 * ##### Dips #####
 * ################
 */

var dependencies = {

        core : require('./lib/dependency/core.js'),
        npm  : require('./lib/dependency/npm.js'),
        file : require('./lib/dependency/file.js')

    },
    Container = require('./lib/dependency/container.js');

/**
 * The dips class.
 *
 * @constructor
 * @param {Object} config
 */
function Dips(config)
{

    /**
     * Resolves the given entity id.
     * Stores the given entities as properties.
     *
     * @memberOf Dips
     * @instance
     * @method $
     * @param {String} value
     * @returns {Mixed|undefined}
     * @see resolve
     */
    this.$ = (function (id)
    {
        return this.resolve(id);
    }).bind(this);

    /**
     * The containers.
     *
     * @memberOf Dips
     * @instance
     * @property containers
     * @private
     * @type {Object.<String, Container>}
     */
    this.containers = {};

    /**
     * The default container.
     *
     * @memberOf Dips
     * @instance
     * @property defaultContainer
     * @private
     * @type {Object.<String, Container>}
     */
    this.defaultContainer = new Container();

    /*
     * +++++++++++++++++++
     * +++ Constructor +++
     * +++++++++++++++++++
     */

    // Register self as dependency
    this.setDependency('dips', this);

    // Check config
    config = config || {};

    /*
     * ----------------
     * --- Entities ---
     * ----------------
     */

    // Check entities
    if (config.hasOwnProperty('entities')) {

        /*
         * Core
         */

        // Check core
        if (config.entities.hasOwnProperty('core')) {
            this.addEntities(dependencies.core.getDependencies(config.entities.core.prefix || undefined));
        }

        /*
         * NPM
         */

        // Check npm
        if (config.entities.hasOwnProperty('npm')) {
            this.addEntities(dependencies.npm.getDependencies(config.entities.npm.prefix || undefined));
        }

        /*
         * Files
         */

        // Check files
        if (config.entities.hasOwnProperty('files')) {
            this.addEntities(dependencies.file.getDependencies(config.entities.files.paths,
                config.entities.files.basePath, config.entities.files.prefix || undefined));
        }

    }

    /*
     * -----------------
     * --- Container ---
     * -----------------
     */

    // Check containers
    if (config.hasOwnProperty('containers')) {
        this.setContainers(config.containers);
    }

    /*
     * ------------------
     * --- Dependency ---
     * ------------------
     */

    // Check dependencies
    if (config.hasOwnProperty('dependencies')) {
        this.setDependencies(config.dependencies);
    }

};

/*
 * ++++++++++++++++
 * +++ Entities +++
 * ++++++++++++++++
 */

/**
 * Adds the given entities to the registry.
 *
 * @memberOf Dips
 * @instance
 * @method addEntities
 * @param {Object.<String, *>} values
 * @returns {Dips}
 */
Dips.prototype.addEntities = function (values)
{

    var self = this;

    // List values
    Object.keys(values).forEach(function (key)
    {

        // Add entity
        self.$[key] = values[key];

    });

    return this;

};

/**
 * Resolves the given entity id.
 *
 * @memberOf Dips
 * @instance
 * @method resolve
 * @param {String} value
 * @returns {Mixed|undefined}
 */
Dips.prototype.resolve = function (value)
{

    var parts,
        result = this.$;

    // Get parts
    parts = value.split('.');

    // List parts
    parts.forEach(function (part)
    {

        // Check result
        if (result === undefined) {
            return;
        }

        // Check existence
        if (result.hasOwnProperty(part)) {
            result = result[part];
        } else {
            result = undefined;
        }

    });

    return result;

};

/*
 * ++++++++++++++++++
 * +++ Containers +++
 * ++++++++++++++++++
 */

/**
 * Returns the ids of registered containers.
 *
 * @memberOf Dips
 * @instance
 * @method getContainers
 * @returns {Array.<String>}
 */
Dips.prototype.getContainers = function ()
{
    return Object.keys(this.containers);
};

/**
 * Sets the containers.
 *
 * @memberOf Dips
 * @instance
 * @method setContainers
 * @param {Object.<String, Mixed>) values
 * @returns {Dips}
 */
Dips.prototype.setContainers = function (values)
{

    // Set containers
    this.containers = values;

    return this;

};

/**
 * Checks if the container with the given id does exist.
 *
 * @memberOf Dips
 * @instance
 * @method hasContainer
 * @param {String} id
 * @returns {Boolean}
 */
Dips.prototype.hasContainer = function (id)
{
    return (this.containers.hasOwnProperty(id)) ? true : false;
};

/**
 * Returns the container with the given id.
 *
 * @memberOf Dips
 * @instance
 * @method getContainer
 * @param {String} id
 * @returns {Container}
 */
Dips.prototype.getContainer = function (id)
{
    return this.containers[id];
};

/**
 * Sets the container with the given id.
 *
 * @memberOf Dips
 * @instance
 * @method setContainer
 * @param {String} id the container id
 * @param {Container} value the container
 * @returns {Dips}
 */
Dips.prototype.setContainer = function (id, value)
{

    // Set container
    this.containers[id] = value;

    return this;

};

/*
 * ++++++++++++++++++++
 * +++ Dependencies +++
 * ++++++++++++++++++++
 */

/**
 * Returns the ids of the registered dependencies from the default container.
 *
 * @memberOf Dips
 * @instance
 * @method getDependencies
 * @returns {Array.<String>}
 * @see Container.getDependencies
 * @see Dips.defaultContainer
 */
Dips.prototype.getDependencies = function ()
{
    return this.defaultContainer.getDependencies();
};

/**
 * Sets the dependencies of the default container.
 *
 * @memberOf Dips
 * @instance
 * @method setDependencies
 * @param {Object.<String, *>} values
 * @returns {Dips}
 * @see Container.setDependencies
 * @see Dips.defaultContainer
 */
Dips.prototype.setDependencies = function (values)
{

    // Set dependencies
    this.defaultContainer.setDependencies(values);

    // Register self as dependency
    this.setDependency('dips', this);

    return this;

};

/**
 * Checks if the dependency with the given id does exist in the default container.
 *
 * @memberOf Dips
 * @instance
 * @method hasDependency
 * @param {String} id
 * @returns {Boolean}
 * @see Container.hasDependency
 * @see Dips.defaultContainer
 */
Dips.prototype.hasDependency = function (id)
{
    return this.defaultContainer.hasDependency(id);
};

/**
 * Returns the dependency with the given id from the default container.
 *
 * @memberOf Dips
 * @instance
 * @method getDependency
 * @param {String} id
 * @returns {*}
 * @see Container.getDependency
 * @see Dips.defaultContainer
 */
Dips.prototype.getDependency = function (id)
{
    return this.defaultContainer.getDependency(id);
};

/**
 * Sets the dependency with the given id of the default container.
 *
 * @memberOf Dips
 * @instance
 * @method setDependency
 * @param {String} id the dependency id
 * @param {*} value the dependency value
 * @returns {Dips}
 * @see Container.setDependency
 * @see Dips.defaultContainer
 */
Dips.prototype.setDependency = function (id, value)
{

    // Set dependency
    this.defaultContainer.setDependency(id, value);

    return this;

};

/*
 * ++++++++++++++
 * +++ Invoke +++
 * ++++++++++++++
 */

/**
 * Invokes the given function, array or object with the default container.
 *
 * @memberOf Dips
 * @instance
 * @method invoke
 * @param {Function|Array|Object|String|*} value
 * @returns {*}
 * @see Container.invoke
 * @see Dips.defaultContainer
 */
Dips.prototype.invoke = function (value)
{

    var entity;

    // Check value is entity
    if (typeof value === 'string') {
        entity = this.resolve(value);
    }

    // Invoke
    return this.defaultContainer.invoke.apply(this.defaultContainer, (function (args)
    {

        var result = [];

        // Check entity
        if (entity) {
            result.push(entity);
        }

        // List arguments
        Object.keys(args).forEach(function (key, i)
        {

            // Check entity
            if (entity && i === 0) {
                return;
            }

            // Add to result
            result.push(args[key]);

        });

        return result;

    })(arguments));

};

/*
 * ###################
 * ##### Exports #####
 * ###################
 */

/**
 * Creates an new instance of Dips.
 *
 * @param {Object} config
 * @returns {Dips}
 */
module.exports = function (config)
{
    return new Dips(config);
};