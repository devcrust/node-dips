/*global suite: false, setup: false, test: false*/

var assert = require('assert'),
    Container = require('../../lib/dependency/container.js');

suite('Dependency Container', function ()
{

    /*
     * ########################
     * ##### Dependencies #####
     * ########################
     */

    suite('Dependencies', function ()
    {

        var dependencies = {

                path : require('path'),
                fs   : require('fs')

            },
            dependencies2 = {

                http : require('http')

            },
            container;

        setup(function ()
        {

            // Create container instance
            container = new Container(dependencies);

        });

        test('#convertId', function ()
        {

            // Check equal
            assert.equal(Container.convertId('foo'), 'foo', 'Result does not match');

            // Check equal
            assert.equal(Container.convertId('$foo'), 'foo', 'Result does not match');

        });

        test('#getDependencies', function ()
        {

            // Check equal
            assert.deepEqual(container.getDependencies(), Object.keys(dependencies), 'Result does not match');

            // Check equal
            assert.deepEqual(Object.keys(dependencies), container.getDependencies(), 'Result does not match');

        });

        test('#setDependencies', function ()
        {

            /*
             * ++++++++++++++
             * +++ Case I +++
             * ++++++++++++++
             */

            // Set dependencies
            container.setDependencies(dependencies2);

            // Check equal
            assert.equal(container.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(container.getDependencies(), Object.keys(dependencies2), 'Result does not match');

            // Check equal
            assert.deepEqual(Object.keys(dependencies2), container.getDependencies(), 'Result does not match');

            /*
             * +++++++++++++++
             * +++ Case II +++
             * +++++++++++++++
             */

            // Set dependencies
            assert.deepEqual(container.setDependencies(dependencies), container, 'Result does not match');

            // Check equal
            assert.deepEqual(container.getDependencies(), Object.keys(dependencies), 'Result does not match');

            // Check equal
            assert.deepEqual(Object.keys(dependencies), container.getDependencies(), 'Result does not match');

        });

        test('#addDependencies', function ()
        {

            /*
             * ++++++++++++++
             * +++ Case I +++
             * ++++++++++++++
             */

            // Reset dependencies
            container.setDependencies({});

            // Set dependencies
            container.addDependencies(dependencies2);

            // Check equal
            assert.equal(container.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(container.getDependencies(), Object.keys(dependencies2), 'Result does not match');

            // Check equal
            assert.deepEqual(Object.keys(dependencies2), container.getDependencies(), 'Result does not match');

            /*
             * +++++++++++++++
             * +++ Case II +++
             * +++++++++++++++
             */

            // Reset dependencies
            container.setDependencies({});

            // Set dependencies
            assert.deepEqual(container.addDependencies(dependencies), container, 'Result does not match');

            // Check equal
            assert.deepEqual(container.getDependencies(), Object.keys(dependencies), 'Result does not match');

            // Check equal
            assert.deepEqual(Object.keys(dependencies), container.getDependencies(), 'Result does not match');

        });

        test('#hasDependency', function ()
        {

            // Check equal
            assert.equal(container.hasDependency('path'), true, 'Dependency does not exist');

            // Check equal
            assert.equal(container.hasDependency('not_exist'), false, 'Dependency does exist');

            // Check equal
            assert.equal(container.hasDependency('fs'), true, 'Dependency does not exist');

        });

        test('#getDependency', function ()
        {

            // Check equal
            assert.deepEqual(container.getDependency('path'), dependencies.path, 'Result does not match');

            // Check equal
            assert.deepEqual(container.getDependency('fs'), dependencies.fs, 'Result does not match');

            // Check equal
            assert.deepEqual(container.getDependency('not_exist'), undefined, 'Result does not match');

        });

        test('#setDependency', function ()
        {

            // Check equal
            assert.equal(container.hasDependency('http'), false, 'Dependency does exist');

            // Set dependency
            assert.deepEqual(container.setDependency('http', dependencies2.http), container, 'Result does not match');

            // Check equal
            assert.equal(container.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(container.getDependency('http'), dependencies2.http, 'Result does not match');

        });

    });

    /*
     * ##################
     * ##### Invoke #####
     * ##################
     */

    suite('Invoke', function ()
    {

        var container = new Container({

            fs   : require('fs'),
            path : require('path')

        });

        test('Invoke with Function', function ()
        {

            /*
             * --------------------
             * --- No Arguments ---
             * --------------------
             */

            // Check equal
            assert.equal(container.invoke(function ()
            {

            }), undefined, 'Result does not match');

            /*
             * -------------------------------
             * --- No additional Arguments ---
             * -------------------------------
             */

            // Check equal
            assert.equal(container.invoke(function ($path)
            {

                return $path.sep;

            }), container.getDependency('path').sep, 'Result does not match');

            /*
             * ----------------------------
             * --- Additional Arguments ---
             * ----------------------------
             */

            // Check equal
            assert.equal(container.invoke(function ($path, foo)
            {

                return ($path.sep + foo);

            }, 'value of foo'), (container.getDependency('path').sep + 'value of foo'), 'Result does not match');

        });

        test('Invoke with Array', function ()
        {

            // Check equal
            assert.deepEqual(container.invoke([]), [], 'Result does not match');

            // Check equal
            assert.deepEqual(container.invoke(['value of foo', 'value of bar', 'path']),
                ['value of foo', 'value of bar', 'path'], 'Result does not match');

            // Check equal
            assert.deepEqual(container.invoke(['value of foo', '$path']),
                ['value of foo', container.getDependency('path')], 'Result does not match');

        });

        test('Invoke with Object', function ()
        {

            // Check equal
            assert.deepEqual(container.invoke({}), {}, 'Result does not match');

            // Check equal
            assert.deepEqual(container.invoke({

                foo  : 'value of foo',
                bar  : 'value of bar',
                path : 'value of path'

            }), {

                foo  : 'value of foo',
                bar  : 'value of bar',
                path : 'value of path'

            }, 'Result does not match')

            // Check equal
            assert.deepEqual(container.invoke({

                $fs   : null,
                $path : undefined,
                foo   : 'value of foo'

            }), {

                $fs   : container.getDependency('fs'),
                $path : container.getDependency('path'),
                foo   : 'value of foo'

            }, 'Result does not match');

        });

        test('Invoke with others', function ()
        {

            // List arguments
            [true, false, null, undefined, 124, 852.2456, 'my string'].forEach(function (value)
            {

                // Check equal
                assert.equal(container.invoke(value), value, 'Result does not match');

            });


        });

    });

});