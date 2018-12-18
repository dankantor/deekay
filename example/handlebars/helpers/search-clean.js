module.exports = (str) => {
  str = decodeURIComponent(str);
  if (str.length > 200) {
    str =  `${str.slice(0, 200)}...`;
  }
  return str;
};