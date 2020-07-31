const { Table } = require('console-table-printer');
const chalk = require('chalk');

const { log, error } = console;
const table = new Table();

const logger = {
  log(msg, color = 'blue') {
    return log(
      chalk[color](msg),
    );
  },
  error(msg, color = 'red') {
    return error(
      chalk[color](msg),
    );
  },
  table(arr) {
    arr.forEach((arrVal) => table.addRow(arrVal, { color: 'green' }));
    table.printTable();
  },
};

module.exports = logger;
