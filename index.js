'use strict';

var _       = require('lodash');
var request = require('request-promise');

var Influx = function (options) {
  options = options || {};

  var defaults = {
    host: '127.0.0.1',
    port: 8086,
    ssl : false,
  };

  options = _.merge(defaults, options);
  _.assign(this, options);

  var endpoint = this.ssl
    ? 'https://'
    : 'http://' + this.host + ':' + this.port;

  this._queryEndpoint = endpoint + '/query';
  this._writeEndpoint = endpoint + '/write';
}

Influx.prototype.query = function(q) {
  var self = this;

  return request({
    url : self._queryEndpoint,
    qs  : {
      db : self.db ? self.db : undefined,
      q  : q
    },
    json: true,
  })
  .then(function(res) {
    return res.results;
  });
};

module.exports = Influx;
