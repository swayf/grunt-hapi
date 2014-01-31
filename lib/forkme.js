'use strict';

var Utils = require('./utils');

process.on('message', function(options) {

  function add_routes(server, routes) {
    for (var key in routes) {
      server.route({
        method: 'GET', path: Utils.cleanPath(key) + '{path*}',
        handler: {
          directory: {
            path: options.bases[key], listing: true, showHidden: true
          }
        }
      });
    }
  }

  if (options.server) {
    try {
      var http = require(options.server);

      if (options.bases) {
        add_routes(http, options.bases);
      }

      http.start();

      if (!options.noasync) {
        process.send(null);
      }
    } catch (e) {
      process.send('Hapi ["' + options.server + '"] -  ' + e);
    }
  } else if (options.server_create) {
    try {

      var create_server = require(options.server_create);

        create_server( function(err, http) {

        if (err)
          process.send('Hapi ["' + options.server + '"] -  ' + e);

        if (options.bases) {
          add_routes(http, options.bases);
        }

        http.start();

        if (!options.noasync) {
          process.send(null);
        }
      });
    } catch (e) {
        process.send('Hapi ["' + options.server + '"] -  ' + e);
    }
  }
  else {
    process.send('Hapi should provide an Hapi server instance or function to create server instance.');
  }
});

process.on('disconnect', function() {
  process.exit();
});
