const path = require('path');

// eslint-disable-next-line no-unused-vars
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  mode: 'development'

}
