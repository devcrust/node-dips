/*global suite: false, test: false, setup: false*/

var assert = require('assert'),
    path = require('path'),
    Dips = require('../dips.js'),
    Container = require('../lib/dependency/container.js');

suite('Dips', function ()
{

    var dependencies = {

            path : require('path'),
            fs   : require('fs')

        },
        dependencies2 = {

            http : require('http')

        },
        container = new Container(),
        container2 = new Container(dependencies2),
        containers = {

            'default' : container

        },
        dips,
        dips2;

    /*
     * ####################
     * ##### Entities #####
     * ####################
     */

    suite('Entities', function ()
    {

        test('#addEntities', function ()
        {

            // Set instance
            dips = Dips();

            // Add entities
            dips.addEntities(dependencies);

            // List dependencies
            Object.keys(dips.$).forEach(function (id)
            {

                // Check equal
                assert.deepEqual(dips.$[id], dependencies[id], 'Result does not match');

            });

        });

        test('#resolve', function ()
        {

            // Set instance
            dips = Dips({

                entities : {

                    files : {

                        basePath : path.resolve(__dirname, '_fixtures'),

                        paths : ['helpers', 'lib']

                    }

                }

            });

            // Check equal
            assert.deepEqual(Object.keys(dips.$),
                Object.keys(require('../lib/entity/file.js').getEntities(['helpers', 'lib'],
                    path.resolve(__dirname, '_fixtures'))), 'Result does not match');

            // Check equal
            assert.equal(dips.resolve('not_exists'), undefined, 'Result does not match');

            // Check equal
            assert.equal(dips.$('not_exists'), undefined, 'Result does not match');

            // Check equal
            assert.equal(dips.resolve('lib.not_exists'), undefined, 'Result does not match');

            // Check equal
            assert.equal(dips.$('lib.not_exists'), undefined, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.resolve('lib.core'), dips.$.lib.core, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.$('lib.core'), dips.$.lib.core, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.resolve('helpers'), dips.$.helpers, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.$('helpers'), dips.$.helpers, 'Result does not match');

        });

        test('No entities', function ()
        {

            // Set instance
            dips = Dips();

            // Check equal
            assert.equal(Object.keys(dips.$).length, 0, 'Result does not match');

        });

        test('File entities', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set instance
            dips = Dips({

                entities : {

                    files : {

                        basePath : path.resolve(__dirname, '_fixtures'),

                        paths : {

                            libraries    : 'lib',
                            json_helpers : 'helpers/view/json'

                        }

                    }

                }

            });

            // Check equal
            assert.deepEqual(Object.keys(dips.$), Object.keys(require('../lib/entity/file.js').getEntities({

                libraries    : 'lib',
                json_helpers : 'helpers/view/json'

            }, path.resolve(__dirname, '_fixtures'))), 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set instance
            dips = Dips({

                entities : {

                    files : {

                        basePath : path.resolve(__dirname, '_fixtures'),

                        paths : {

                            libraries    : 'lib',
                            json_helpers : 'helpers/view/json'

                        },

                        prefix : 'my'

                    }

                }

            });

            // Check equal
            assert.deepEqual(Object.keys(dips.$), Object.keys(require('../lib/entity/file.js').getEntities({

                libraries    : 'lib',
                json_helpers : 'helpers/view/json'

            }, path.resolve(__dirname, '_fixtures'), 'my')), 'Result does not match');

        });

    });

    /*
     * ######################
     * ##### Containers #####
     * ######################
     */

    suite('Containers', function ()
    {

        setup(function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set instance
            dips = Dips();

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set instance
            dips2 = Dips({

                containers : {

                    'default' : new Container()

                }

            });

        });

        test('#getContainers', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.deepEqual(dips.getContainers(), [], 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.deepEqual(dips2.getContainers(), Object.keys(containers), 'Result does not match');

        });

        test('#setContainers', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.deepEqual(dips.setContainers(containers), dips, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.getContainers(), Object.keys(containers), 'Result does not match');

            // Check equal
            assert.deepEqual(dips.setContainers({}), dips, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.getContainers(), [], 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.deepEqual(dips2.setContainers({}), dips2, 'Result does not match');

            // Check equal
            assert.deepEqual(dips2.getContainers(), [], 'Content does not match');

            // Check equal
            assert.deepEqual(dips2.setContainers(containers), dips2, 'Result does not match');

            // Check equal
            assert.deepEqual(dips2.getContainers(), Object.keys(containers), 'Result does not match');

        });

        test('#hasContainer', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.equal(dips.hasContainer('not_exist'), false, 'Container does exist');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.equal(dips2.hasContainer(Object.keys(containers)[0]), true, 'Container does not exist');

            // Check equal
            assert.equal(dips2.hasContainer('not_exist'), false, 'Container does exist');

        });

        test('#getContainer', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.equal(dips.getContainer('not_exist'), undefined, 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.deepEqual(dips2.getContainer(Object.keys(containers)[0]), containers[Object.keys(containers)[0]],
                'Result does not match')

            // Check equal
            assert.equal(dips2.getContainer('not_exist'), undefined, 'Result does not match');

        });

        test('#setContainer', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.deepEqual(dips.setContainer('custom', container2), dips, 'Result does not match');

            // Check equal
            assert.equal(dips.hasContainer('custom'), true, 'Container does not exist');

            // Check equal
            assert.deepEqual(dips.getContainer('custom'), container2, 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.deepEqual(dips2.setContainer('custom', container2), dips2, 'Result does not match');

            // Check equal
            assert.equal(dips2.hasContainer('custom'), true, 'Container does not exist');

            // Check equal
            assert.deepEqual(dips2.getContainer('custom'), container2, 'Result does not match');

        });

    });

    /*
     * ########################
     * ##### Dependencies #####
     * ########################
     */

    suite('Dependencies', function ()
    {

        setup(function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set instance
            dips = Dips();

            // Set dependencies
            dips.setDependencies({

                path : require('path'),
                fs   : require('fs')

            });

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set instance
            dips2 = Dips({

                dependencies : {

                    path : require('path'),
                    fs   : require('fs')

                }

            });

        });

        test('Self Dependency', function ()
        {

            // Check equal
            assert.deepEqual(dips.getDependency('dips'), dips, 'Result does not match');

            // Check equal
            assert.deepEqual(dips2.getDependency('$dips'), dips2, 'Result does not match');

        });

        test('#getDependencies', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(dependencies);

                // Add dips
                keys.push('dips');

                // Sort keys
                keys.sort()

                return keys;


            })(), 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.deepEqual(dips2.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(dependencies);

                // Add dips
                keys.unshift('dips');

                // Sort keys
                keys.sort()

                return keys;


            })(), 'Result does not match');

        });

        test('#setDependencies', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set dependencies
            assert.deepEqual(dips.setDependencies(dependencies2), dips, 'Result does not match');

            // Check equal
            assert.equal(dips.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), Object.keys(dependencies2).sort(), 'Result does not match');

            // Set dependencies
            assert.deepEqual(dips.setDependencies(dependencies), dips, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), Object.keys(dependencies).sort(), 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set dependencies
            assert.deepEqual(dips2.setDependencies(dependencies2), dips2, 'Result does not match');

            // Check equal
            assert.equal(dips2.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(dips2.getDependencies().sort(), Object.keys(dependencies2).sort(), 'Result does not match');

            // Set dependencies
            assert.deepEqual(dips2.setDependencies(dependencies), dips2, 'Result does not match');

            // Check equal
            assert.deepEqual(dips2.getDependencies().sort(), Object.keys(dependencies).sort(), 'Result does not match');

        });

        test('#hasDependency', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.equal(dips.hasDependency('path'), true, 'Dependency does not exist');

            // Check equal
            assert.equal(dips.hasDependency('not_exist'), false, 'Dependency does exist');

            // Check equal
            assert.equal(dips.hasDependency('fs'), true, 'Dependency does not exist');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.equal(dips2.hasDependency('path'), true, 'Dependency does not exist');

            // Check equal
            assert.equal(dips2.hasDependency('not_exist'), false, 'Dependency does exist');

            // Check equal
            assert.equal(dips2.hasDependency('fs'), true, 'Dependency does not exist');

        });

        test('#getDependency', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */


            // Check equal
            assert.deepEqual(dips.getDependency('path'), dependencies.path, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.getDependency('fs'), dependencies.fs, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.getDependency('not_exist'), undefined, 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.deepEqual(dips2.getDependency('path'), dependencies.path, 'Result does not match');

            // Check equal
            assert.deepEqual(dips2.getDependency('fs'), dependencies.fs, 'Result does not match');

            // Check equal
            assert.deepEqual(dips2.getDependency('not_exist'), undefined, 'Result does not match');

        });

        test('#setDependency', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Check equal
            assert.equal(dips.hasDependency('http'), false, 'Dependency does exist');

            // Set dependency
            assert.deepEqual(dips.setDependency('http', dependencies2.http), dips, 'Result does not match');

            // Check equal
            assert.equal(dips.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(dips.getDependency('http'), dependencies2.http, 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Check equal
            assert.equal(dips2.hasDependency('http'), false, 'Dependency does exist');

            // Set dependency
            assert.deepEqual(dips2.setDependency('http', dependencies2.http), dips2, 'Result does not match');

            // Check equal
            assert.equal(dips2.hasDependency('http'), true, 'Dependency does not exist');

            // Check equal
            assert.deepEqual(dips2.getDependency('http'), dependencies2.http, 'Result does not match');

        });

        test('Core dependencies', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    core : true

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies(), (function ()
            {

                var keys = Object.keys(require('../lib/dependency/core.js').getDependencies());

                // Add dips
                keys.unshift('dips');

                return keys;


            })(), 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    core : {

                        prefix : 'core'

                    }

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies(), (function ()
            {

                var keys = Object.keys(require('../lib/dependency/core.js').getDependencies('core'));

                // Add dips
                keys.unshift('dips');

                return keys;


            })(), 'Result does not match');

        });

        test('NPM dependencies', function ()
        {

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    npm : true

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(require('../lib/dependency/npm.js').getDependencies());

                // Add dips
                keys.push('dips');

                // Sort keys
                keys.sort();

                return keys;


            })(), 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    npm : {

                        prefix : 'npm'

                    }

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(require('../lib/dependency/npm.js').getDependencies('npm'));

                // Add dips
                keys.unshift('dips');

                // Sort keys
                keys.sort()

                return keys;


            })(), 'Result does not match');

            /*
             * ----------------
             * --- Case III ---
             * ----------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    npm : {

                        ignore : ['mocha']

                    }

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(require('../lib/dependency/npm.js').getDependencies(undefined, ['mocha']));

                // Add dips
                keys.unshift('dips');

                // Sort keys
                keys.sort()

                return keys;


            })(), 'Result does not match');

        });

        test('Core and NPM dependencies', function ()
        {

            function extend(source, target)
            {

                // Check target
                target = target || {};

                // List source keys
                Object.keys(source).forEach(function (key)
                {
                    target[key] = source[key];
                });

                return target;

            };

            /*
             * --------------
             * --- Case I ---
             * --------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    core : true,
                    npm  : true

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(extend(require('../lib/dependency/npm.js').getDependencies(),
                    require('../lib/dependency/core.js').getDependencies()));

                // Add dips
                keys.unshift('dips');

                // Sort keys
                keys.sort();

                return keys;


            })(), 'Result does not match');

            /*
             * ---------------
             * --- Case II ---
             * ---------------
             */

            // Set instance
            dips = Dips({

                dependencies : {

                    core : {

                        prefix : 'core'

                    },

                    npm : {

                        prefix : 'npm'

                    }

                }

            });

            // Check equal
            assert.deepEqual(dips.getDependencies().sort(), (function ()
            {

                var keys = Object.keys(extend(require('../lib/dependency/npm.js').getDependencies('npm'),
                    require('../lib/dependency/core.js').getDependencies('core')));

                // Add dips
                keys.unshift('dips');

                // Sort keys
                keys.sort();

                return keys;


            })(), 'Result does not match');

        });

    });

    /*
     * ##################
     * ##### Invoke #####
     * ##################
     */

    suite('Invoke', function ()
    {

        setup(function ()
        {

            // Set instance
            dips = Dips();

            // Set dependencies
            dips.setDependencies(dependencies);

        });

        test('Invoke with Function', function ()
        {

            /*
             * --------------------
             * --- No Arguments ---
             * --------------------
             */

            // Check equal
            assert.equal(dips.invoke(function ()
            {

            }), undefined, 'Result does not match');

            /*
             * -------------------------------
             * --- No additional Arguments ---
             * -------------------------------
             */

            // Check equal
            assert.equal(dips.invoke(function ($path)
            {

                return $path.sep;

            }), dips.getDependency('path').sep, 'Result does not match');

            /*
             * ----------------------------
             * --- Additional Arguments ---
             * ----------------------------
             */

            // Check equal
            assert.equal(dips.invoke(function ($path, foo)
            {

                return ($path.sep + foo);

            }, 'value of foo'), (dips.getDependency('path').sep + 'value of foo'), 'Result does not match');

        });

        test('Invoke with Array', function ()
        {

            // Check equal
            assert.deepEqual(dips.invoke([]), [], 'Result does not match');

            // Check equal
            assert.deepEqual(dips.invoke(['value of foo', 'value of bar', 'path']),
                ['value of foo', 'value of bar', 'path'], 'Result does not match');

            // Check equal
            assert.deepEqual(dips.invoke(['value of foo', '$path']),
                ['value of foo', dips.getDependency('path')], 'Result does not match');

        });

        test('Invoke with Object', function ()
        {

            // Check equal
            assert.deepEqual(dips.invoke({}), {}, 'Result does not match');

            // Check equal
            assert.deepEqual(dips.invoke({

                foo  : 'value of foo',
                bar  : 'value of bar',
                path : 'value of path'

            }), {

                foo  : 'value of foo',
                bar  : 'value of bar',
                path : 'value of path'

            }, 'Result does not match')

            // Check equal
            assert.deepEqual(dips.invoke({

                $fs   : null,
                $path : undefined,
                foo   : 'value of foo'

            }), {

                $fs   : dips.getDependency('fs'),
                $path : dips.getDependency('path'),
                foo   : 'value of foo'

            }, 'Result does not match');

        });

        test('Invoke with others', function ()
        {

            // List arguments
            [true, false, null, undefined, 124, 852.2456, 'my string'].forEach(function (value)
            {

                // Check equal
                assert.equal(dips.invoke(value), value, 'Result does not match');

            });


        });

        test('Invoke with entity', function ()
        {

            // Set instance
            dips = Dips({

                dependencies : {

                    db_config : {

                        type     : 'mysql',
                        host     : 'localhost',
                        port     : 3306,
                        user     : 'root',
                        password : 'pwd'

                    }

                }

            });

            // Add entities
            dips.addEntities({

                lib : {

                    database : {

                        adapter : {

                            mysql : function (host, port, user, password)
                            {

                                if (host !== 'localhost') {
                                    return false;
                                }

                                else if (port !== 3306) {
                                    return false;
                                }

                                else if (user !== 'root') {
                                    return false;
                                }

                                else if (password !== 'pwd') {
                                    return false;
                                }

                                return 'Connection established';

                            }

                        },

                        connection : function ($db_config, $dips)
                        {

                            if ($db_config.type === 'mysql') {
                                return $dips.$.lib.database.adapter.mysql($db_config.host, $db_config.port,
                                    $db_config.user, $db_config.password);
                            }

                        }

                    }

                }

            });

            // Check equal
            assert.equal(dips.invoke('lib.database.connection'), 'Connection established', 'Result does not match');

        });

    });

});