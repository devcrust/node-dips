/*global suite: false, test: false*/

var assert = require('assert'),
    path = require('path'),
    file = require('../../lib/entity/file.js');

suite('File Entities', function ()
{

    var fixturesPath = path.resolve(__dirname, '../_fixtures'),
        entities;

    test('Folder as String', function ()
    {

        /*
         * --------------
         * --- Case I ---
         * --------------
         */

        // Get entities
        entities = file.getEntities('lib', fixturesPath);

        // Check matches content
        assert.deepEqual(entities, {

            lib : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            }

        }, 'Entities do not match');

        // Check matches content
        assert.equal(entities.lib.npm, require(path.join(fixturesPath, '/lib/npm.js')),
            'Entities for "npm" do not match');

        // Check matches content
        assert.equal(entities.lib.npm.$['npm.json'], require(path.join(fixturesPath, '/lib/npm.json')),
            'Entities for "npm" do not match');
        /*
         * +++++++++++++++
         * +++ Case II +++
         * +++++++++++++++
         */

        // Get entities
        entities = file.getEntities('helpers/view/json', fixturesPath);

        // Check matches content
        assert.deepEqual(entities, {

            json : {

                parse     : require(path.join(fixturesPath, '/helpers/view/json/parse.js')),
                stringify : require(path.join(fixturesPath, '/helpers/view/json/stringify.js'))

            }

        }, 'Entities do not match');

        /*
         * ---------------
         * --- Case II ---
         * ---------------
         */

        // Get entities
        entities = file.getEntities('helpers/view', fixturesPath);

        // Check matches content
        assert.equal(entities.view.json.valueOf(), 'json.js', 'Entities do not match');

        // Check matches content
        assert.equal(entities.view.json.parse,
            require(path.join(fixturesPath, '/helpers/view/json/parse.js')), 'Entities do not match');

        // Check matches content
        assert.equal(entities.view.json.stringify,
            require(path.join(fixturesPath, '/helpers/view/json/stringify.js')), 'Entities do not match');

    });

    test('Folders as Array', function ()
    {

        /*
         * --------------
         * --- Case I ---
         * --------------
         */

        // Get entities
        entities = file.getEntities(['lib', 'helpers/view/json'], fixturesPath);

        // Check matches content
        assert.deepEqual(entities, {

            lib : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            },

            json : {

                parse     : require(path.join(fixturesPath, '/helpers/view/json/parse.js')),
                stringify : require(path.join(fixturesPath, '/helpers/view/json/stringify.js'))

            }

        }, 'Entities do not match');

        /*
         * ---------------
         * --- Case II ---
         * ---------------
         */

        // Get entities
        entities = file.getEntities(['helpers/view'], fixturesPath);

        // Check matches content
        assert.equal(entities.view.json.valueOf(), 'json.js', 'Entities do not match');

        // Check matches content
        assert.equal(entities.view.json.parse,
            require(path.join(fixturesPath, '/helpers/view/json/parse.js')), 'Entities do not match');

        // Check matches content
        assert.equal(entities.view.json.stringify,
            require(path.join(fixturesPath, '/helpers/view/json/stringify.js')), 'Entities do not match');

    });

    test('Folders as Object', function ()
    {

        /*
         * --------------
         * --- Case I ---
         * --------------
         */

        // Get entities
        entities = file.getEntities({

            libraries    : 'lib',
            json_helpers : 'helpers/view/json'

        }, fixturesPath);

        // Check matches content
        assert.deepEqual(entities, {

            libraries : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            },

            json_helpers : {

                parse     : require(path.join(fixturesPath, '/helpers/view/json/parse.js')),
                stringify : require(path.join(fixturesPath, '/helpers/view/json/stringify.js'))

            }

        }, 'Entities do not match');

        /*
         * ---------------
         * --- Case II ---
         * ---------------
         */

        // Get entities
        entities = file.getEntities({

            'view' : 'helpers/view'

        }, fixturesPath);

        // Check matches content
        assert.equal(entities.view.json.valueOf(), 'json.js', 'Entities do not match');

        // Check matches content
        assert.equal(entities.view.json.parse,
            require(path.join(fixturesPath, '/helpers/view/json/parse.js')), 'Entities do not match');

        // Check matches content
        assert.equal(entities.view.json.stringify,
            require(path.join(fixturesPath, '/helpers/view/json/stringify.js')), 'Entities do not match');

    });

    test('Prefix', function ()
    {

        // Get entities
        entities = file.getEntities('lib', fixturesPath, 'my');

        // Check matches content
        assert.deepEqual(entities, {

            my_lib : {

                core : require(path.join(fixturesPath, '/lib/core.js')),
                file : require(path.join(fixturesPath, '/lib/file.js')),
                npm  : require(path.join(fixturesPath, '/lib/npm.js'))

            }

        }, 'Entities do not match');

    });

});