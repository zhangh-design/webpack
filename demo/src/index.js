// import Vue from 'vue'
// import Vuex from 'vuex'
import _ from 'lodash'
import $ from 'jquery';
// import b from '@/b'

function component () {
  const element = document.createElement('div');
  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  // console.log(Vue)
  // console.log(Vuex)
  // console.log(b)
  console.log('jquery ', $)
  return element;
}

document.body.appendChild(component());
