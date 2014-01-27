# Dips [![NPM version](https://badge.fury.io/js/dips.png)](http://badge.fury.io/js/dips) [![Build Status](https://travis-ci.org/devcrust/node-dips.png?branch=master)](https://travis-ci.org/devcrust/node-dips)

A simple yet powerful dependency injection and entity (file) management framework for Node.js

[![NPM](https://nodei.co/npm/dips.png)](https://nodei.co/npm/dips/)

---

## Features

* Inject all types of dependencies (Function, Object/Instance, Array, Boolean, String, Number, etc.)
* Support for Node.js core and NPM dependencies out of the box
* File entity resolver (folder/sub-folder/file.js becomes `Dips.$.folder.sub-folder.file`)
* Fast (lazy loading support)
* Re-register dependencies
* Supports multiple containers/scopes
* Has no dependencies of its own

---

## Installation

To install the latest stable version:

```sh
npm install dips
```

---

## Examples

### Create a new instance

Create a new `Dips` instance:

```js
var Dips = require('dips'),
    dips = Dips({
    
        entities : {
            
            files : {
                basePath : __dirname,
                paths    : ['lib']     
            }
          
        },
    
        dependencies : {
            core : true,
            npm  : true
        }
    
    });
```

### Register dependencies

Register new dependencies by calling `Dips.setDependency`:

```js
// Register "config" dependency
dips.setDependency('db_config', {

    host : 'localhost',
    port : '3306',
    user : 'root',
    password : 'secret'

});

// Register "db" dependency
dips.setDependency('db', function($db_config, $mysql) // $mysql registered by the "npm" dependencies
{
    return $mysql.createConnection($db_config);
});
```

### Resolve dependencies

Resolve a dependency by calling `Dips.invoke`:

```js
// Example I: Invoke function
dips.invoke(function($db, callback)
{
    $db.query('SELECT * FROM sometable', function(error, rows)
    {
        // ...
    });
});

// Example II: Invoke function
dips.invoke(function($fs, $path) // $fs and $path registered by the "core" dependencies
{
    $fs.readdirSync($path.resolve(__dirname, '..'));
});
```

### Get (file) entities

Get (file) entities by using the object `Dips.$` or the function `Dips.resolve`:

```js
// Useful if your IDE supports auto completion based on JSDOC (like PhpStorm)
dips.$.lib.database.connection // equals: require('./lib/database/connection.js)

// Using just a string (for instance from configurations)
dips.resolve('lib.database.connection') // equals: require('./lib/database/connection.js)

// Using the shortcut function
dips.$('lib.database.connection') // equals: require('./lib/database/connection.js)

```

---

## API

### Dips

---

#### Options for `Dips()`

* `entities ([Object.<String, *>])` - the entities to register _(optional)_
    - `files ([Object.<String, *>])` - the file entities to register _(optional)_
        - `basePath (String)` - the absolute base path to use
        - `paths (String | Array.<String> | Object.<String, String>)` - the file paths to parse, relative to the given `basePath`
        - `prefix ([String=""])` - the prefix to use e.g. "app" -> "app\_myentity", etc. _(optional)_

* `dependencies ([Object.<String, *>])` - the dependencies to register for the default container (optional)
    - `core ([Object.<String, *> | *])` - if present (typically with the value of `true`), registers the Node.js core modules e.g. fs, path, http, etc. as dependencies _(optional)_
        - `prefix ([String=""])` - the optional prefix to use e.g. "core" -> "core\_fs", etc. _(optional)_
    - `npm ([Object.<String, *> | *])` - if present (typically with the value of `true`), registers the installed NPM modules (behaves like [module.require](http://nodejs.org/api/modules.html#modules_all_together)) as dependencies _(optional)_
        - `prefix ([String=""])` - the optional prefix to use e.g. "npm" -> "npm\_express", etc. _(optional)_
        - `ignore ([Array.<String, RegExp>])` - the optional ignores added to the default ignores ".bin" and ".gitignore" _(optional)_
    - `...` - the custom dependencies to register, dependency id as key `String` _(optional)_
* `containers ([Object.<String, Container>])` - the dependency containers to register _(optional)_

---

#### Properties

##### `Entities`

* `$ (Function)` - the entity resolver function and registry object (_alias for `Dips.resolve`_)

```js
// Useful if your IDE supports auto completion based on JSDOC (like PhpStorm)
dips.$.lib.database.connection // equals: require('./lib/database/connection.js)

// Using the shortcut function
dips.$('lib.database.connection') // equals: require('./lib/database/connection.js)
```

#### Methods

---

##### `Entities`

* `addEntities(Object.<String, *> values)` - adds the given custom entities

* `resolve(String value)` - resolves the entity with the given name e.g. "lib.database.connection", etc.

---

##### `Containers`

* `getContainers()` - returns the ids of the registered dependency containers

* `setContainers(Object.<String, *> values)` - sets and overrides the given dependency containers

* `hasContainer(String id)` - checks if the dependency container with given id does exist

* `getContainer(String id)` - returns the dependency container with the given id

* `setContainer(String id, Container value)` - sets the dependency container with the given id and value

##### `Dependencies`

_The following methods are inherited from `Container`_

* `getDependencies()` - returns the ids of the registered dependencies within the `defaultContainer`

* `setDependencies(Object.<String, *> values)` - sets and overrides the given dependencies within the `defaultContainer`

* `addDependencies(Object.<String, *> values)` - adds the given dependencies within the `defaultContainer`

* `hasDependency(String id)` - checks if the dependency with the given id does exist within the `defaultContainer`

* `getDependency(String id)` - returns the dependency with the given id from the `defaultContainer`

* `setDependency(String id, * value)` - sets the dependency with the given id and value within the `defaultContainer`

* `invoke(Function|Array|Object|String|* value)` - invokes the given value with the dependencies from the `defaultContainer` and the provided additional _(non dependency)_ arguments

---

### Invoke explained

##### Invoke with `Function`

All function parameters starting with `$` will be replaced with the value of the corresponding dependency, `undefined` otherwise.  
It is possible to pass additional function arguments (indicated without a leading `$`). The additional arguments must be passed in the corresponding order of the function parameters.  

Consider the following function parameters: `foo, $db, bar, $fs`:  
The additional arguments must be passed in the following order: `'value of foo', 'value of bar'`

###### Example

```js
// Invoke function
dips.invoke(function($db)
{
    // $db is equal to dips.getDependency('db')
});

// Invoke function with additional arguments
dips.invoke(function($db, query)
{
    // $db is equal to dips.getDependency('db')
    // query is equal to the given argument
}, 'SELECT * FROM sometable');
```

##### Invoke with `Array`

By passing an array to `Dips.invoke()`, the array values will be iterated and all `String` values starting with `$` will be replaced with the value of the corresponding dependency, `undefined` otherwise.

###### Example

```js
// Invoke array
dips.invoke(['$fs', '$path', {}]); // $fs and $path will be replaced with the corresponding
```

##### Invoke with `Object`

If an object is passed to `Dips.invoke()`, the object will be iterated and the value of the `keys` starting with `$` will be replaced with the corresponding dependency, `undefined` otherwise.

###### Example

```js
// Invoke object
dips.invoke({

    $db_config : null, // value will be equal to dips.getDependency('db_config')
    $mysql     : null, // value will be equal to dips.getDependency('mysql') or require('mysql')
    query      : 'SELECT * FROM sometable'

});
```

__Passing other types (`string`, `number`, `boolean`, `null`, `undefined`) as value for `Dips.invoke` will be returned as they are, without modification.__

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2014 - Christoph Rust

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[![Analytics](https://ga-beacon.appspot.com/UA-47502134-1/node-dips/readme)]()