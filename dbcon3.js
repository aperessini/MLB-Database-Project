var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,

  host            : 'us-cdbr-iron-east-05.cleardb.net',
  user            : 'b0a26cbff55b03',
  password        : '7a61ce21',
  database        : 'heroku_cc6ae3ba323a65b'

});

module.exports.pool = pool;
