module.exports = (name) => {
  name = encodeURIComponent(name);
  return `@@imagesUri/${name}`;
};