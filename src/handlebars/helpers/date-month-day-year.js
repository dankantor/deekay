const dateFormat = require('dateformat');

module.exports = (dateTime) => {
  return dateFormat(dateTime, 'mmm dd, yyyy');
};