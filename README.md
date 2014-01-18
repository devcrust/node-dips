# Dips [![Build Status](https://api.travis-ci.org/devcrust/node-dips.png)](https://api.travis-ci.org/devcrust/node-dips.png)

A simple yet powerfull dependency injection and entity (file) management framework for Node.js

---

## Features

* Inject all types of dependencies (Function, Object/Instance, Array, Boolean, Number, ...)
* Support for Node.js core and NPM dependencies out of the box
* Fast (lazy loading support)
* Re-register dependencies
* Supports multiple containers/scopes
* Has no dependencies of its own

---

## Examples

### Create a new instance

Create a new `Dips` container:

```js
var Dips = require('dips'),
    dips = Dips();
```

### Register dependencies

Register new dependencies by calling `dips.setDependency`:

```js
// Register "config" dependency
dips.setDependency('db_config', {

    host : 'localhost',
    port : '3306',
    user : 'root',
    password : 'secret'

});

// Register "db" dependency
dips.setDependency('db', function($db_config)
{
    return require('mysql').createConnection($db_config);
});
```

### Resolve dependencies

Resolve a dependency by calling `dips.invoke`:

```js
// Invoke function
dips.invoke(function($db, callback)
{
    $db.query('SELECT * FROM sometable', function(error, rows)
    {
        // ...
    });
});
```