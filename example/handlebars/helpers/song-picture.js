module.exports = (item, serviceName) => {
  if (serviceName) {
    if (item[serviceName].picture) {
      return item[serviceName].picture;
    } else {
      return getAvailable(item);
    }
  } else {
    return getAvailable(item);
  }
};

const getAvailable = (item) => {
  if (item.spotify.picture) {
    return item.spotify.picture;
  } else if (item.napster.picture) {
    return item.napster.picture;
  } else if (item.apple.picture) {
    return item.apple.picture;
  }
};