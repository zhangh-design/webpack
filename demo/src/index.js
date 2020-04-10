import _join from 'lodash/join'

// eslint-disable-next-line no-unused-vars
const b = '';

function component () {
  const element = document.createElement('div');
  new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
  }).then(r => {
    console.log(r);
  });
  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
