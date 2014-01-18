/*global suite: false, test: false*/

var assert = require('assert'),
    Container = require('../../lib/dependency/container.js'),
    args = require('../../lib/helper/arguments.js');

suite('Helpers :: Arguments', function ()
{

    /*
     * ##################################
     * ##### Arguments Result Class #####
     * ##################################
     */

    suite('Result', function ()
    {

        var list1 = ['foo', 'bar', '$Logger', '$db'],
            list2 = ['bar', '$db'],
            instance1 = new args.ArgumentsResult(list1),
            instance2 = new args.ArgumentsResult();

        test('Accessibility', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check arguments result
            assert.deepEqual(instance1.getArguments(), list1, 'Result does not match');

            // Check argument position
            assert.equal(instance1.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

            // Check argument position
            assert.equal(instance1.getArgumentPosition('foo'), 0, 'Argument position does not match');

            // Check argument position
            assert.equal(instance1.getArgumentPosition('$db'), 3, 'Argument position does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check arguments result
            assert.deepEqual(instance2.getArguments(), [], 'Result does not match');

            // Check argument position
            assert.equal(instance2.getArgumentPosition('not_exist'), -1, 'Argument position does not match');


        });

        test('Usual Arguments', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check arguments result
            assert.deepEqual(instance1.getUsualArguments(), ['foo', 'bar'], 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isUsualArgument('foo'), true, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isUsualArgument('bar'), true, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isUsualArgument('$Logger'), false, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isUsualArgument('$db'), false, 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check arguments result
            assert.deepEqual(instance2.getUsualArguments(), [], 'Result does not match');

        });

        test('DI Arguments', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check arguments result
            assert.deepEqual(instance1.getDiArguments(), ['$Logger', '$db'], 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isDiArgument('$Logger'), true, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isDiArgument('$db'), true, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isDiArgument('$'), false, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isDiArgument('foo'), false, 'Result does not match');

            // Check equal
            assert.equal(args.ArgumentsResult.isDiArgument('bar'), false, 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check arguments result
            assert.deepEqual(instance2.getDiArguments(), [], 'Result does not match');

        });

        test('Modifications', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set list
            list1 = ['foo', '$db'];

            // Set arguments
            instance1.setArguments(list1);

            // Check arguments result
            assert.deepEqual(instance1.getArguments(), list1, 'Result does not match');

            // Check argument position
            assert.equal(instance1.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

            // Check argument position
            assert.equal(instance1.getArgumentPosition('foo'), 0, 'Argument position does not match');

            // Check argument position
            assert.equal(instance1.getArgumentPosition('$db'), 1, 'Argument position does not match');

            // Check usual arguments result
            assert.deepEqual(instance1.getUsualArguments(), ['foo'], 'Result does not match');

            // Check di arguments result
            assert.deepEqual(instance1.getDiArguments(), ['$db'], 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set list
            list2 = ['$Logger', 'bar'];

            // Set arguments
            instance2.setArguments(list2);

            // Check arguments result
            assert.deepEqual(instance2.getArguments(), list2, 'Result does not match');

            // Check argument position
            assert.equal(instance2.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

            // Check argument position
            assert.equal(instance2.getArgumentPosition('bar'), 1, 'Argument position does not match');

            // Check argument position
            assert.equal(instance2.getArgumentPosition('$Logger'), 0, 'Argument position does not match');

            // Check usual arguments result
            assert.deepEqual(instance2.getUsualArguments(), ['bar'], 'Result does not match');

            // Check di arguments result
            assert.deepEqual(instance2.getDiArguments(), ['$Logger'], 'Result does not match');

        });

    });

    /*
     * ##################
     * ##### Parser #####
     * ##################
     */

    suite('Parser', function ()
    {

        var result;

        test('Function without arguments', function ()
        {

            // Get result
            result = args.parse(function ()
            {

            });

            // Check result
            assert.deepEqual(result.getArguments(), [], 'Arguments do not match');

            // Check di arguments
            assert.deepEqual(result.getDiArguments(), [], 'DI arguments do not match');

            // Check usual arguments
            assert.deepEqual(result.getUsualArguments(), [], 'Usual arguments do not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

        });

        test('Function with arguments', function ()
        {

            // Get result
            result = args.parse(function (foo, bar)
            {

            });

            // Check result
            assert.deepEqual(result.getArguments(), ['foo', 'bar'], 'Arguments do not match');

            // Check di arguments
            assert.deepEqual(result.getDiArguments(), [], 'DI arguments do not match');

            // Check usual arguments
            assert.deepEqual(result.getUsualArguments(), ['foo', 'bar'], 'Usual arguments do not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('foo'), 0, 'Argument position does not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('bar'), 1, 'Argument position does not match');

        });

        test('Function with dependencies', function ()
        {

            // Get result
            result = args.parse(function ($Logger, $db)
            {

            });

            // Check result
            assert.deepEqual(result.getArguments(), ['$Logger', '$db'], 'Arguments do not match');

            // Check di arguments
            assert.deepEqual(result.getDiArguments(), ['$Logger', '$db'], 'DI arguments do not match');

            // Check usual arguments
            assert.deepEqual(result.getUsualArguments(), [], 'Usual arguments do not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('$Logger'), 0, 'Argument position does not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('$db'), 1, 'Argument position does not match');

        });

        test('Function with arguments and dependencies', function ()
        {

            // Get result
            result = args.parse(function (foo, _bar21, __misc_stuff, $Logger, $db)
            {

            });

            // Check result
            assert.deepEqual(result.getArguments(), ['foo', '_bar21', '__misc_stuff', '$Logger', '$db'],
                'Arguments do not match');

            // Check di arguments
            assert.deepEqual(result.getDiArguments(), ['$Logger', '$db'], 'DI arguments do not match');

            // Check usual arguments
            assert.deepEqual(result.getUsualArguments(), ['foo', '_bar21', '__misc_stuff'],
                'Usual arguments do not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('not_exist'), -1, 'Argument position does not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('_bar21'), 1, 'Argument position does not match');

            // Check argument position
            assert.equal(result.getArgumentPosition('$Logger'), 3, 'Argument position does not match');

        });

    });

    /*
     * ###################
     * ##### Builder #####
     * ###################
     */

    suite('Builder', function ()
    {

        var container = new Container({

                fs     : require('fs'),
                path   : require('path'),
                reader : function ($fs)
                {
                    return $fs;
                }

            }),
            result;

        test('with Object', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Get result
            result = args.parse(function ()
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container), [], 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Get result
            result = args.parse(function (foo, bar)
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container, ['value of foo', 'value of bar']),
                ['value of foo', 'value of bar'], 'Result does not match');

            /*
             * ----------------
             * --- Case III ---
             * ----------------
             */

            // Get result
            result = args.parse(function ($fs, foo, bar, $path)
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container, [
                {

                    foo : 'value of foo',
                    bar : 'my value of bar'

                }
            ]), [container.getDependency('fs'), 'value of foo', 'my value of bar', container.getDependency('path')],
                'Result does not match');

            /*
             * ---------------
             * --- Case IV ---
             * ---------------
             */

            // Get result
            result = args.parse(function ($fs, foo, bar, $path)
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container, [
                {

                    $fs : 'my fs',
                    foo : 'value of foo',
                    bar : 'my value of bar'

                }
            ]), [container.getDependency('fs'), 'value of foo', 'my value of bar', container.getDependency('path')],
                'Result does not match');

            /*
             * --------------
             * --- Case V ---
             * --------------
             */

            // Get result
            result = args.parse(function ($fs)
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container), [container.getDependency('fs')], 'Result does not match');

        });

        test('with Arguments', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Get result
            result = args.parse(function ()
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container, undefined), [], 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Get result
            result = args.parse(function (foo, bar)
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container, ['value of foo', 'value of bar']),
                ['value of foo', 'value of bar'], 'Result does not match');

            /*
             * ----------------
             * --- Case III ---
             * ----------------
             */

            // Get result
            result = args.parse(function ($fs, foo, bar, $path)
            {

            });

            // Check equal
            assert.deepEqual(args.build(result, container, ['value of foo', 'my value of bar']),
                [container.getDependency('fs'), 'value of foo', 'my value of bar', container.getDependency('path')],
                'Result does not match');

        });

    });

});