const Db = require('tingodb')().Db;
const db = new Db(`${__dirname}/db`, {});

module.exports = db;