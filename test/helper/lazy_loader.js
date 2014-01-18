/*global suite: false, test: false*/

var assert = require('assert'),
    loader = require('../../lib/helper/lazy_loader.js');

suite('Helpers :: Lazy Loader', function ()
{

    var modules = ['fs', 'http', 'util', '../../lib/dependency/core.js'],
        modulesExports = modules.map(function (value)
        {

            return require(value);

        }),
        result;

    test('Values as Array', function ()
    {

        // Get result
        result = loader(modules);

        // Check result keys
        assert.deepEqual(Object.keys(result), modules, 'Result keys do not match');

        // Check result values
        assert.deepEqual(Object.keys(result).map(function (key)
        {

            return result[key];

        }), modulesExports, 'Result values do not match');

    });

    test('Values as Object', function ()
    {

        // Get result
        result = loader({

            'fs'   : 'fs',
            'http' : 'http',
            'util' : 'util',
            'core' : '../../lib/dependency/core.js'

        });

        // Check result keys
        assert.deepEqual(Object.keys(result), ['fs', 'http', 'util', 'core'], 'Result keys do not match');

        // Check result values
        assert.deepEqual(Object.keys(result).map(function (key)
        {

            return result[key];

        }), modulesExports, 'Result values do not match');

    });

    test('Not existing module', function ()
    {

        // Get result
        result = loader(['fs', 'not_exist']);

        // Check result keys
        assert.deepEqual(Object.keys(result), ['fs', 'not_exist'], 'Result keys do not match');

    });

});