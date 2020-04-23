import { add, minus } from './a.js'
// import _ from 'lodash'
import Vue from 'vue'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import "./a.scss"

console.log(add, minus, Vue, VueX, VueRouter)

// import "core-js/modules/es.promise";
// import "core-js/modules/es.array.iterator";

function getComponent() {
  return import(/* webpackChunkName:"lodash" */ "lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}

getComponent().then(element=>{
    document.body.appendChild(element)
})

/* const promise = new Promise(function (resolve, reject) {
  // ... some code

  resolve('some code');
});
promise.then(val => console.log(val)) */
