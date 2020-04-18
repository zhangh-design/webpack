// import '@babel/polyfill';
import _join from "lodash/join";
import axios from "axios";
// window.Promise = Promise;
import "core-js/modules/es.promise";

function component() {
  const element = document.createElement("div");
  element.innerHTML = _join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());

const getData = () => {
  axios.get("/react/api/header.json").then(res => {
    console.log(res);
  });
  /* const promise = new Promise(function(resolve, reject) {
    if (true){
      console.log('1111111111111111111');
      resolve();
    } else {
      reject();
    }
  }); */
};

setTimeout(() => {
  getData();
}, 1000);
