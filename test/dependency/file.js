/*global suite: false, test: false*/

var assert = require('assert'),
    path = require('path'),
    file = require('../../lib/dependency/file.js');

suite('File Dependencies', function ()
{

    var fixturesPath = path.resolve(__dirname, '../_fixtures'),
        dependencies;

    test('Folder as String', function ()
    {

        /*
         * --------------
         * --- Case I ---
         * --------------
         */

        // Get dependencies
        dependencies = file.getDependencies('lib', fixturesPath);

        // Check matches content
        assert.deepEqual(dependencies, {

            lib : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            }

        }, 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.lib.npm, require(path.join(fixturesPath, '/lib/npm.js')),
            'Dependencies for "npm" do not match');

        // Check matches content
        assert.equal(dependencies.lib.npm.$['npm.json'], require(path.join(fixturesPath, '/lib/npm.json')),
            'Dependencies for "npm" do not match');
        /*
         * +++++++++++++++
         * +++ Case II +++
         * +++++++++++++++
         */

        // Get dependencies
        dependencies = file.getDependencies('helpers/view/json', fixturesPath);

        // Check matches content
        assert.deepEqual(dependencies, {

            json : {

                parse     : require(path.join(fixturesPath, '/helpers/view/json/parse.js')),
                stringify : require(path.join(fixturesPath, '/helpers/view/json/stringify.js'))

            }

        }, 'Dependencies do not match');

        /*
         * ---------------
         * --- Case II ---
         * ---------------
         */

        // Get dependencies
        dependencies = file.getDependencies('helpers/view', fixturesPath);

        // Check matches content
        assert.equal(dependencies.view.json.valueOf(), 'json.js', 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.view.json.parse,
            require(path.join(fixturesPath, '/helpers/view/json/parse.js')), 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.view.json.stringify,
            require(path.join(fixturesPath, '/helpers/view/json/stringify.js')), 'Dependencies do not match');

    });

    test('Folders as Array', function ()
    {

        /*
         * --------------
         * --- Case I ---
         * --------------
         */

        // Get dependencies
        dependencies = file.getDependencies(['lib', 'helpers/view/json'], fixturesPath);

        // Check matches content
        assert.deepEqual(dependencies, {

            lib : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            },

            json : {

                parse     : require(path.join(fixturesPath, '/helpers/view/json/parse.js')),
                stringify : require(path.join(fixturesPath, '/helpers/view/json/stringify.js'))

            }

        }, 'Dependencies do not match');

        /*
         * ---------------
         * --- Case II ---
         * ---------------
         */

        // Get dependencies
        dependencies = file.getDependencies(['helpers/view'], fixturesPath);

        // Check matches content
        assert.equal(dependencies.view.json.valueOf(), 'json.js', 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.view.json.parse,
            require(path.join(fixturesPath, '/helpers/view/json/parse.js')), 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.view.json.stringify,
            require(path.join(fixturesPath, '/helpers/view/json/stringify.js')), 'Dependencies do not match');

    });

    test('Folders as Object', function ()
    {

        /*
         * --------------
         * --- Case I ---
         * --------------
         */

        // Get dependencies
        dependencies = file.getDependencies({

            libraries    : 'lib',
            json_helpers : 'helpers/view/json'

        }, fixturesPath);

        // Check matches content
        assert.deepEqual(dependencies, {

            libraries : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            },

            json_helpers : {

                parse     : require(path.join(fixturesPath, '/helpers/view/json/parse.js')),
                stringify : require(path.join(fixturesPath, '/helpers/view/json/stringify.js'))

            }

        }, 'Dependencies do not match');

        /*
         * ---------------
         * --- Case II ---
         * ---------------
         */

        // Get dependencies
        dependencies = file.getDependencies({

            'view' : 'helpers/view'

        }, fixturesPath);

        // Check matches content
        assert.equal(dependencies.view.json.valueOf(), 'json.js', 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.view.json.parse,
            require(path.join(fixturesPath, '/helpers/view/json/parse.js')), 'Dependencies do not match');

        // Check matches content
        assert.equal(dependencies.view.json.stringify,
            require(path.join(fixturesPath, '/helpers/view/json/stringify.js')), 'Dependencies do not match');

    });

    test('Prefix', function()
    {

        // Get dependencies
        dependencies = file.getDependencies('lib', fixturesPath, 'my');

        // Check matches content
        assert.deepEqual(dependencies, {

            my_lib : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            }

        }, 'Dependencies do not match');

    });

});