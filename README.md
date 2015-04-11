# node-influx
InfluxDB client for node / iojs.

This library uses the excellent [bluebird](https://github.com/petkaantonov/bluebird) library, take a look at the [promise API](https://github.com/petkaantonov/bluebird/blob/master/API.md) to see how you can make the best use of this library.

## Usage

### Simple Example

Calculate the 90th percentile first, then find all latency measurements within that 90th percentile.

```javascript
client.query('SELECT percentile(ms, 95) FROM latency')
  .then(function(results) {

    var percentile = results[0].series[0].values[0][1];

    var query  = 'SELECT mean(ms) FROM latency \
      WHERE time > now() - 10m \
      AND ms < ' + percentile + ' \
      GROUP BY time(1s)';

    return client.query(query).then(function(results) {
      console.log(results[0].series[0].values);
    });

  })
  .catch(function(err) {
    console.error(err);
  });
```

### Advanced Example

Execute a bunch of queries, and settle for any that were successful.

```javascript
  // fetch some metrics for the last 5 minutes
  var metrics = [
    client.query('SELECT mean(ms) FROM latency WHERE time > now() - 5m fill(0)'),
    client.query('SELECT percentile(ms, 90) FROM latency WHERE time > now() - 5m fill(0)'),
    client.query('SELECT (count(ms) / 300) as reqss FROM latency WHERE time > now() - 5m fill(0)')
  ];

  // we'll settle for any successful requests
  promise.settle(metrics).then(function(results) {

    // find all fulfilled promises
    results = _.filter(function(result) {
      return result.isFulfilled();
    });

    console.log(results);
  });
```