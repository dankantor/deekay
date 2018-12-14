const Handlebars = require('hbsfy/runtime');

module.exports = (item, service) => {
  let html = '';
  if (item && service) {
    if (!item[service].id) {
      html = '<div class="warning">30 sec sample</div>';
    }
  } else {
    html = '<div class="warning">30 sec sample</div>';
  }
  return new Handlebars.SafeString(html);
};