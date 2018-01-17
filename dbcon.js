var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_steinaua',
  password        : '3172',
  database        : 'cs340_steinaua'
});

module.exports.pool = pool;
