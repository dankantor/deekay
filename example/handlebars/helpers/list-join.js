module.exports = (char, list, prop) => {
  if (list && list.length > 0) {
    if (prop && typeof prop === 'string') {
      list = list.map(item => item[prop]);
    }
    return list.join(char);
  } else {
    return '';
  }
};