'use strict';

var Influx  = require('../index');

var client = new Influx({
  host : '127.0.0.1',
  db   : 'foo',
});

client.query('select * from latency')
  .then(function(results) {
    console.log('Resuls: %j', results);
  })
  .catch(function(err) {
    console.error('Error: %j', err);
  })