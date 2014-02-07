/*global suite: false, test: false*/

var path = require('path'),
    assert = require('chai').assert,
    loader = require('../../src/lib/helper/lazy_loader.js');

suite('Helpers :: Lazy Loader', function ()
{

    var modules = ['fs', 'http', 'util', path.resolve(__dirname, '../../src/lib/dependency/core.js')],
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
        assert.deepEqual(Object.keys(result).sort(), modules.sort(), 'Result keys do not match');

        // Check result values
        assert.deepEqual(Object.keys(result).map(function (key)
        {

            return result[key];

        }).sort(), modulesExports.sort(), 'Result values do not match');

    });

    test('Values as Object', function ()
    {

        // Get result
        result = loader({

            'fs'   : 'fs',
            'http' : 'http',
            'util' : 'util',
            'core' : path.resolve(__dirname, '../../src/lib/dependency/core.js')

        });

        // Check result keys
        assert.deepEqual(Object.keys(result).sort(), ['fs', 'http', 'util', 'core'].sort(), 'Result keys do not match');

        // Check result values
        assert.deepEqual(Object.keys(result).map(function (key)
        {

            return result[key];

        }).sort(), modulesExports.sort(), 'Result values do not match');

    });

    test('Not existing module', function ()
    {

        // Get result
        result = loader(['fs', 'not_exist']);

        // Check result keys
        assert.deepEqual(Object.keys(result).sort(), ['fs', 'not_exist'].sort(), 'Result keys do not match');

    });

});