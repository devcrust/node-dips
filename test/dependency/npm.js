/*global suite: false, test: false*/

var assert = require('assert'),
    util = require('util'),
    npm = require('../../lib/dependency/npm.js');

suite('NPM Dependencies', function ()
{

    var modules = npm.modules,
        dependencies = npm.getDependencies();

    test('Accessibility', function ()
    {

        // Check is array
        assert.equal(Array.isArray(modules), true, 'Modules is not an array');

        // Check is object
        assert.equal(dependencies instanceof Object, true, 'Dependencies not an object');

        // Check matches content
        assert.deepEqual(Object.keys(dependencies), modules, 'Dependencies do not match');

    });

    test('Availability', function ()
    {

        // List modules
        modules.forEach(function (id)
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

});