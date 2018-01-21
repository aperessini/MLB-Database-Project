var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,

  host            : 'us-cdbr-iron-east-05.cleardb.net',
  user            : 'b25ede2f7682b2',
  password        : '19e5320c',
  database        : 'heroku_e6268a292e03deb'

});

module.exports.pool = pool;
