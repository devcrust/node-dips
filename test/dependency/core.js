/*global suite: false, test: false*/

var assert = require('assert'),
    util = require('util'),
    core = require('../../lib/dependency/core.js');

suite('Core Dependencies', function ()
{

    var modules = core.modules,
        dependencies = core.getDependencies();

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

            // Check "repl" module [as require('repl') !== require('repl')] // TODO check later node versions
            if (id === 'repl') {

                // Check object keys only
                assert.deepEqual(Object.keys(dependencies[id]), Object.keys(require(id)),
                    util.format('Result for core module "%s" does not match', id));

                return;

            }

            // Check is available
            assert.doesNotThrow(function ()
            {

                // Load module and store result
                result = require(id);

            }, Error, util.format('Core module "%s" does not exist', id));

            // Check accessor
            assert.deepEqual(dependencies[id], result,
                util.format('Result for core module "%s" does not match', id));

        });

    });

    test('Prefix', function ()
    {

        // Get dependencies
        dependencies = core.getDependencies('my_prefix');

        // List modules
        Object.keys(dependencies).forEach(function (key)
        {

            var id = key.substr(10),
                result;

            // Check "repl" module [as require('repl') !== require('repl')] // TODO check later node versions
            if (id === 'repl') {

                // Check object keys only
                assert.deepEqual(Object.keys(dependencies[key]), Object.keys(require(id)),
                    util.format('Result for core module "%s" does not match', key));

                return;

            }

            // Check is available
            assert.doesNotThrow(function ()
            {

                // Load module and store result
                result = require(id);

            }, Error, util.format('Core module "%s" does not exist', key));

            // Check accessor
            assert.deepEqual(dependencies[key], result,
                util.format('Result for core module "%s" does not match', key));

        });

    });

});