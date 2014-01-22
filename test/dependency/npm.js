/*global suite: false, test: false*/

var assert = require('assert'),
    util = require('util'),
    npm = require('../../lib/dependency/npm.js');

suite('NPM Dependencies', function ()
{

    var dependencies;

    test('Availability', function ()
    {

        // Get dependencies
        dependencies = npm.getDependencies();

        // List modules
        Object.keys(dependencies).forEach(function (id)
        {

            var result;

            // Check is available
            assert.doesNotThrow(function ()
            {

                // Load module and store result
                result = require(id);

            }, Error, util.format('NPM module "%s" does not exist', id));

            // Check accessor
            assert.deepEqual(dependencies[id], result,
                util.format('Result for NPM module "%s" does not match', id));

        });

    });

    test('Prefix', function ()
    {

        // Get dependencies
        dependencies = npm.getDependencies('my_prefix');

        // List modules
        Object.keys(dependencies).forEach(function (key)
        {

            var id = key.substr(10),
                result;

            // Check is available
            assert.doesNotThrow(function ()
            {

                // Load module and store result
                result = require(id);

            }, Error, util.format('NPM module "%s" does not exist', key));

            // Check accessor
            assert.deepEqual(dependencies[key], result,
                util.format('Result for NPM module "%s" does not match', key));

        });

    });

    test('Ignore', function ()
    {

        // Get dependencies
        dependencies = npm.getDependencies(undefined, ['mocha']);

        // Check equal
        assert.deepEqual(dependencies, [], 'Result does not match');

        // Get dependencies
        dependencies = npm.getDependencies(undefined, [/mocha/]);

        // Check equal
        assert.deepEqual(dependencies, [], 'Result does not match');

    });

});