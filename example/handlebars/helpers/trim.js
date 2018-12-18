module.exports = (str, len) => {
  if (str && str.length > len) {
    return `${str.substr(0, len)}...`;
  } else {
    return str;
  }
};